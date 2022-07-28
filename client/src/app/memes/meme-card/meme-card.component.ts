import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, SecurityContext, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { MemeService } from 'src/app/_services/meme.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { HelperService } from 'src/app/_services/helper.service';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs/operators';
import { Reply } from 'src/app/_models/reply';
import { AdminService } from 'src/app/_services/admin.service';
import { SwitchDivisionComponent } from 'src/app/modals/switch-division/switch-division.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Division } from 'src/app/_models/division';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-meme-card',
  templateUrl: './meme-card.component.html',
  styleUrls: ['./meme-card.component.css'],
})
export class MemeCardComponent implements OnInit, PipeTransform {
  @Input() member: Member;
  @Input() meme: Meme;
  likes: number = 0;
  users: any;
  user: User;
  memes: Partial<Meme[]>;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  format;
  trustedUrl: any;
  waterMarkImage: ElementRef;
  liked: boolean;
  disliked: boolean;
  favourite: boolean;
  likedMemes: Meme[];
  favouriteMemes: Meme[];
  comments: number;
  replies: Reply[];
  division: Division;

  constructor(public presence: PresenceService, private memeService: MemeService, private http: HttpClient,
    public sanitizer: DomSanitizer, public helper: HelperService, public accountService: AccountService,
    private toastr: ToastrService, private adminService: AdminService, private modalService: NgbModal) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    }
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    // temporary solution for incorrect timezone
    var newTime = Number(this.meme?.uploaded?.substring(11,13)) - 2;
    this.meme.uploaded = this.meme?.uploaded?.replace((this.meme?.uploaded?.substring(11,14)), newTime.toString() + ":");
    this.getNumberOfComments(this.meme.id);
    if(this.meme?.url?.includes("youtube") || this.meme?.url?.includes("youtu.be")) {
      this.trustedUrl = this.formatYoutubeLink(this.meme?.url);
    }
    if ("user" in localStorage) {
      this.getFavouriteMemes(this.user.username);
      this.loadLikes();
      this.getDivisionNameById(this.meme.division);
    } else {
      this.liked = false;
      this.disliked = false;
    }
  }
  
  addLike(meme: Meme) {
    if ("user" in localStorage) {
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
    } else {
      this.toastr.error("Funkcja tylko dla zalogowanych użytkowników");
    }
  }

  flagAsSpam(memeId: number) {
    this.memeService.flagAsSpam(memeId);
    this.toastr.success("Jebać spammerów!");
  }

  addDislike(meme: Meme) {
    if ("user" in localStorage) {
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
    } else {
      this.toastr.error("Funkcja tylko dla zalogowanych użytkowników");
    }
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

  checkIfMemeLiked(id: number) {
    if (id === this.meme.id) {
      this.liked = !this.liked;
    }
  }

  checkIfMemeDisliked(id: number) {
    if (id === this.meme.id) {
      this.disliked = !this.disliked;
    }
  }

  addFavourite(memeId: number) {
    if ("user" in localStorage) {
      this.memeService.addFavourite(memeId).subscribe(() => {
        this.favourite = !this.favourite;
      if(this.favourite) {
        this.favourite = true;
      } else {
        this.favourite = false;
      }
    })
   } else {
    this.toastr.error("Funkcja tylko dla zalogowanych użytkowników");
  }
}

  replaceTitle(title: string) {
    title.replace(" ", "-");
  }

  convertText(title: string) {
    var result = title?.toLowerCase().split(' ').join('-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return result;
  }

  checkURL(url: string) {
    return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  formatYoutubeLink(url: string) {
    var id = '';
    if (url.includes('youtube')) {
      id = url?.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be')) {
      id = url?.split('be/')[1];
    }
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

  changeTimeZone(uploadedDate: string) {
    uploadedDate = this.helper.changeTimeZone(uploadedDate);
    return uploadedDate;
  }

  addImageWatermark(imageUrl: string) {
    var watermarkedUrl = imageUrl.replace("/upload/", "/upload/l_logo_gimp_-_new_ucilaf,o_50,w_0.4,c_scale,g_south_east/")
    return watermarkedUrl;
  }

  getNumberOfComments(memeId: number) {
    this.memeService.getNumberOfComments(memeId).subscribe(comments => {
      this.comments = comments;
    });
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
    if (id === this.meme.id) {
      this.favourite = !this.favourite;
    }
  }

  rejectMeme(memeId: number) {
    this.adminService.rejectMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  getDivisionNameById(divisionId: number) {
    this.adminService.getDivisionNameById(divisionId).subscribe(division => {
      this.division = division;
      });
    }

  openDivisionModal(meme: Meme) {
    const modalRef = this.modalService.open(SwitchDivisionComponent);
    modalRef.componentInstance.meme = meme;
    modalRef.componentInstance.modalRef = modalRef;
  }
}