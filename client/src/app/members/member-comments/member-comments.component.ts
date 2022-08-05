import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { MemeDetailComponent } from 'src/app/memes/meme-detail/meme-detail.component';
import { Reply } from 'src/app/_models/reply';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemeService } from 'src/app/_services/meme.service';
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-member-comments',
  templateUrl: './member-comments.component.html',
  styleUrls: ['./member-comments.component.css']
})
export class MemberCommentsComponent implements OnInit {
  @Input() comment: any;
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  url: string;
  user: User;
  replyForm: UntypedFormGroup;
  validationErrors: string[] = [];
  reply: boolean;
  replyQuote: boolean;
  replies: Reply[];
  liked: boolean;
  disliked: boolean;
  likedComments: any;
  memeDetail: MemeDetailComponent;
  logged: boolean = false;
  commentUpdate: boolean = false;
  uploader: FileUploader;
  baseUrl = environment.apiUrl;
  imageChangedEvent: any = '';
  mainMemes: number;

  constructor(private memeService: MemeService, public accountService: AccountService,
    private toastr: ToastrService, private fb: UntypedFormBuilder, private helperService: HelperService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.logged = true;
  }

  ngOnInit(): void {
    //this.getUserPhoto(this.comment.username);
    this.getReplies(this.comment.id);
    if ("user" in localStorage) {
      this.loadLikes();
      this.getMemberMainMemes(this.user.username)
    }
  }

  getUserPhoto(username: string) {
    this.memeService.getUserPhoto(username).subscribe(photo => {
      this.url = photo?.url;
    })
  }

  removeComment(commentId) {
    this.memeService.removeComment(commentId).subscribe(comment => {
      this.comment.id = commentId
    });
    this.comment.content = "[Komentarz został usunięty]";
  }

  reloadComments(comment) {
    this.memeDetail.getComments(comment.memeId);
  }

  replyComment() {
    if (this.uploader?.queue?.length !== 0) {
      this.uploader.uploadAll();
      this.toastr.success('Pomyślnie dodano komentarz');
    } else if (this.uploader?.queue?.length === 0) {
      this.memeService.addReply(this.replyForm.value).subscribe(response => {
        this.toastr.success('Pomyślnie dodano odpowiedź');
        this.replyForm.reset();
        this.reply = false;
        this.replyQuote = false;
        this.getReplies(this.comment.id);
        this.reply = !this.reply;
        }, error => {
        this.validationErrors = error;
      })
    }
  }

  getMemberMainMemes(username: string) {
    this.memeService.getMemberMainMemes(username).subscribe(memes => {
      this.mainMemes = memes;
    })
  }  

  addReply(commentId) {
    this.reply = !this.reply;
    this.initializeForm(commentId);
    this.initializeUploader();
  }

  addQuotedReply(commentId) {
    this.replyQuote = !this.replyQuote;
    this.initializeQuoteForm(commentId);
    this.initializeUploader();
  }

  initializeForm(commentId) {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.comment.memeId],
      commentId: [commentId],
      replyingToUser: [this.comment.username]
    })
  }

  initializeQuoteForm(commentId) {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.comment.memeId],
      quote: [this.comment.content],
      commentId: [commentId],
      replyingToUser: [this.comment.username]
    })
  }

  getReplies(commentId: number) {
    this.memeService.getReplies(commentId).subscribe(replies => {
      this.replies = replies;
    });
  }

  addLike(comment: any) {
    this.memeService.addCommentLike(comment.id).subscribe(() => {
      this.liked = !this.liked;
    if(this.liked) {
      this.comment.numberOfLikes++;
      this.liked = true;
    } else {
      this.comment.numberOfLikes--;
      this.liked = false;
    }
  })
}

addDislike(comment: any) {
    this.memeService.addCommentDislike(comment.id).subscribe(() => {
      this.disliked = !this.disliked;
    if(this.disliked) {
      this.comment.numberOfLikes--;
      this.disliked = true;
      this.liked = false;
    } else {
      this.comment.numberOfLikes++;
      this.disliked = false;
    }
  })
}

loadLikes() {
  this.memeService.getCommentLikes().subscribe(response => {
    this.likedComments = response;
    for (var comment of this.likedComments) {
      if (comment.disliked === true) {
        this.checkIfCommentDisliked(comment.likedCommentId);
      } else {
        this.checkIfCommentLiked(comment.likedCommentId);
      }
    }
  })
}

checkIfCommentLiked(id: number) {
  if (id === this.comment.id) {
    this.liked = !this.liked;
  }
}

checkIfCommentDisliked(id: number) {
  if (id === this.comment.id) {
    this.disliked = !this.disliked;
  }
}

editCommentToggle(commentId: number) {
  this.commentUpdate = !this.commentUpdate;
  //this.initializeEditForm(commentId);
}

editComment() {
  this.memeService.updateComment(this.comment).subscribe(() => {
    this.editForm.reset(this.editForm.value);
    this.commentUpdate = !this.commentUpdate;
  })
}

reloadCurrentPage() {
  window.setTimeout(function(){location.reload()},100);
 }

 initializeUploader() {
  let maxFileSize = 10 * 1024 * 1024;
  this.uploader = new FileUploader({
    url: this.baseUrl + 'memes/add-reply-with-image/' + this.comment.memeId,
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
      case 'fileType':
        message = 'Nieobsługiwany format pliku.'
        break;
      default:
        message = 'Wystąpił błąd';
        break;
    }
    this.toastr.warning(message);
  };

  this.uploader.onAfterAddingFile = (file) => {
    file.withCredentials = false;
    file.file.name = this.replyForm.value.content + '^' + this.comment.id;
  }

  this.uploader.onSuccessItem = (item, response) => {
    if (response) {
      const reply: Reply = JSON.parse(response);
         this.accountService.setCurrentUser(this.user);
         this.toastr.success('Pomyślnie dodano komentarz');
         this.getReplies(this.comment.id);
         this.replyForm.reset();
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

  checkIfUserWorthy(mainMemes: number) {
    return this.helperService.checkIfUserWorthy(mainMemes);
  }
}
