import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { HelperService } from 'src/app/_services/helper.service';
import { MemeService } from 'src/app/_services/meme.service';
import { Location } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-meme-detail',
  templateUrl: './meme-detail.component.html',
  styleUrls: ['./meme-detail.component.css']
})
export class MemeDetailComponent implements OnInit {
  meme: Meme;
  memes: Meme[];
  comments: Comment[];
  members: Member;
  users: any;
  id: number = +this.route.snapshot.paramMap.get('id');
  likes: number = 0;
  numberOfComments: number;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  trustedUrl: any;
  commentForm: FormGroup;
  validationErrors: string[] = [];
  liked: boolean;
  disliked: boolean;
  likedMemes: Meme[];
  likedMeme: Meme;
  uploader: FileUploader;
  baseUrl = environment.apiUrl;
  user: User;
  imageChangedEvent: any = '';
  favourite: boolean;
  url: string[];
  division: any;
  favouriteMemes: Meme[];
  mainMemes: number;

  constructor(private memeService: MemeService, private http: HttpClient,
    private route: ActivatedRoute, private toastr: ToastrService,
    private helper: HelperService, private fb: FormBuilder, private router: Router,
    private location: Location, public accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
     }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.meme = data.meme;
    });
    if ("user" in localStorage) {
      this.initializeUploader();
      this.initializeForm();
      this.loadLikes();
      this.getFavouriteMemes(this.user.username);
      this.getMemberMainMemes(this.user.username);
    }
    this.getMeme(this.id);
    this.getComments(this.id);
    this.getNumberOfComments(this.id);
  }

  getMeme(memeId: number) {
    this.memeService.getMeme(memeId).subscribe(meme => {
      this.meme = meme;
      if(this.meme.division !== 0) {
        this.getDivisionNameById(this.meme.division);
      }
      this.id = meme.id;
      if (this.meme.url.includes("youtube")) {
        this.trustedUrl = this.formatYoutubeLink(this.meme.url)
      }
    })
  }
  
  changeTimeZone(uploadedDate: string) {
    uploadedDate = this.helper?.changeTimeZone(uploadedDate)!;
    return uploadedDate;
  }

  addLike(meme: Meme) {
      this.memeService.addLike(meme.id).subscribe(() => {
        this.liked = !this.liked;
      if(this.liked) {
        this.meme.numberOfLikes++;
        this.liked = true;
      } else {
        this.meme.numberOfLikes--;
        this.liked = false;
      }
    })
  }

  addDislike(meme: Meme) {
      this.memeService.addDislike(meme.id).subscribe(() => {
        this.disliked = !this.disliked;
      if(this.disliked) {
        this.meme.numberOfLikes--;
        this.disliked = true;
        this.liked = false;
      } else {
        this.meme.numberOfLikes++;
        this.disliked = false;
      }
    })
  }

  loadLikes() {
    this.memeService.getLikes().subscribe(response => {
      this.likedMemes = response;
      for (var meme of this.likedMemes) {
        if (meme.disliked === true) {
          this.checkIfMemeDisliked(meme.likedMemeId);
        } else {
          this.checkIfMemeLiked(meme.likedMemeId);
        }
      }
    })
  }

  getMemberMainMemes(username: string) {
    this.memeService.getMemberMainMemes(username).subscribe(memes => {
      this.mainMemes = memes;
    })
  }  

  checkIfMemeLiked(id: number) {
    if (id === this.id) {
      this.liked = !this.liked;
      console.log(id);
    }
  }

  checkIfMemeDisliked(id: number) {
    if (id === this.id) {
      this.disliked = !this.disliked;
    }
  }

  checkURL(url: string) {
    return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  onErrorFunction() {
    this.toastr.error("Adres url jest zjebany!")
  }

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

  initializeForm() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.id]
    })
  }

  addComment() {
    if (this.uploader?.queue?.length !== 0) {
      this.uploader.uploadAll();
      this.toastr.success('Pomyślnie dodano komentarz');
    } else if (this.uploader?.queue?.length === 0) {
      this.memeService.addComment(this.commentForm.value).subscribe(response => {
        this.toastr.success('Pomyślnie dodano komentarz');
        this.getComments(this.id);
        this.commentForm.reset();
        }, error => {
        this.validationErrors = error;
      })
    }
  }

  getComments(memeId: number) {
    this.memeService.getComments(memeId).subscribe(comments => {
      this.comments = comments;
    });
  }

  addImageWatermark(imageUrl: string) {
    var watermarkedUrl = imageUrl.replace("/upload/", "/upload/l_logo_gimp_-_new_ucilaf,o_50,w_200,c_scale,g_south_east/")
    return watermarkedUrl;
  }

  getNumberOfComments(memeId: number) {
    this.memeService.getNumberOfComments(memeId).subscribe(comments => {
      this.numberOfComments = comments;
    });
  }

  initializeUploader() {
    let maxFileSize = 10 * 1024 * 1024;
    this.uploader = new FileUploader({
      url: this.baseUrl + 'memes/add-comment-with-image/' + this.id,
      authToken: 'Bearer ' + this.user.token,
      allowedFileType: ['image'],
      isHTML5: true,
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: maxFileSize
    });

    this.uploader.onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      switch (filter.name) {
        case 'fileSize':
          message = 'Plik jest za duży. Rozmiar pliku to ' + this.formatBytes(item.size) + ', podczas gdy maksymalny dopuszczalny rozmiar to ' + this.formatBytes(maxFileSize);
          break;
        default:
          message = 'Wystąpił błąd';
          break;
      }
      this.toastr.warning(message);
    };

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      file.file.name = this.commentForm.value.content;
    }

    this.uploader.onSuccessItem = (item, response) => {
      if (response) {
        const meme: Meme = JSON.parse(response);
           this.accountService.setCurrentUser(this.user);
           this.toastr.success('Pomyślnie dodano komentarz');
           this.getComments(this.id);
           this.commentForm.reset();
      }
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  private formatBytes(bytes: number, decimals?: number) {
    if (bytes == 0) return '0 Bytes';
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }

  flagAsSpam(memeId: number) {
    this.memeService.flagAsSpam(memeId);
    this.toastr.success("Jebać spammerów!");
  }

  addFavourite(memeId: number) {
    this.memeService.addFavourite(memeId).subscribe(() => {
      this.favourite = !this.favourite;
    if(this.favourite) {
      this.favourite = true;
    } else {
      this.favourite = false;
    }
  })
  }

  getFavouriteMemes(username: string) {
    this.memeService.getFavouritesList(username).subscribe(response => {
      this.favouriteMemes = response;
      if (this.favouriteMemes?.length > 0) {
        for (var meme of this.favouriteMemes) {
          this.checkIfMemeFavourite(meme.memeId);
        }
      }
    });
  }

  checkIfMemeFavourite(id: number) {
    if (id === this.id) {
      this.favourite = !this.favourite;
    }
  }

  getDivisionNameById(divisionId: number) {
    this.memeService.getDivisionNameById(divisionId).subscribe(division => {
      this.division = division;
      if ("user" in localStorage) {

      } else {
        if(this.division.isCloseDivision) {
          this.router.navigateByUrl('/');
          this.toastr.error("Zaloguj się aby mieć dostęp");
        }
      }
    })
  }

}
