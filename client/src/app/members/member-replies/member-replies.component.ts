import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Reply } from 'src/app/_models/reply';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemeService } from 'src/app/_services/meme.service';
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/_services/helper.service';

@Component({
  selector: 'app-member-replies',
  templateUrl: './member-replies.component.html',
  styleUrls: ['./member-replies.component.css']
})
export class MemberRepliesComponent implements OnInit {
  @Input() reply: Reply;
  @Input() comment: any;
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  user: User;
  url: string;
  replyField: boolean;
  replyForm: UntypedFormGroup;
  validationErrors: any;
  liked: boolean;
  disliked: boolean;
  likedReplies: any;
  username: any;
  uploader: FileUploader;
  baseUrl = environment.apiUrl;
  imageChangedEvent: any = '';
  replies: any;
  replyQuote: boolean;
  ifReply: boolean;
  commentUpdate: boolean;
  mainMemes: number;

  constructor(public accountService: AccountService, private memeService: MemeService,
    private fb: UntypedFormBuilder, private toastr: ToastrService, private helperService: HelperService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.getUserPhoto(this.reply?.username);
    if ("user" in localStorage) {
      this.loadLikes();
      this.getMemberMainMemes(this.user.username);
    }
  }

  getUserPhoto(username: string) {
    this.memeService.getUserPhoto(username).subscribe(photo => {
      this.url = photo?.url;
    })
  }

  removeReply(replyId: number) {
    this.memeService.removeReply(replyId).subscribe(reply => {
      this.reply.id = replyId
    });
    this.reply.content = "[Komentarz został usunięty]";
  }

  addReply() {
    this.ifReply = !this.ifReply;
    this.replyField = !this.replyField;
    this.initializeForm()
  }

  initializeForm() {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.reply.memeId],
      commentId: [this.reply.commentId],
      replyingToUser: [this.reply.username],
      replyingToReplyId: [this.reply.id]
    })
  }

  getReplies(username: string) {
    this.memeService.getMemberReplies(username).subscribe(replies => {
      this.replies = replies;
    });
  }

  replyComment() {
    this.memeService.addReplyToReply(this.replyForm.value).subscribe(response => {
      this.toastr.success('Pomyślnie dodano odpowiedź');
      this.replyForm.reset();
      this.replyField = !this.replyField;
      }, error => {
      this.validationErrors = error;
    })
    this.replyField = false;
    this.replyQuote = false;
  }

  addLike(reply: Reply) {
    this.memeService.addReplyLike(reply.id).subscribe(() => {
      this.liked = !this.liked;
    if(this.liked) {
      this.reply.numberOfLikes++;
      this.liked = true;
    } else {
      this.reply.numberOfLikes--;
      this.liked = false;
    }
  })
}

addDislike(reply: Reply) {
    this.memeService.addReplyDislike(reply.id).subscribe(() => {
      this.disliked = !this.disliked;
    if(this.disliked) {
      this.reply.numberOfLikes--;
      this.disliked = true;
      this.liked = false;
    } else {
      this.reply.numberOfLikes++;
      this.disliked = false;
    }
  })
}

loadLikes() {
  this.memeService.getReplyLikes().subscribe(response => {
    this.likedReplies = response;
    for (var reply of this.likedReplies) {
      if (reply.disliked === true) {
        this.checkIfReplyDisliked(reply.likedReplyId);
      } else {
        this.checkIfReplyLiked(reply.likedReplyId);
      }
    }
  })
}

checkIfReplyLiked(id: number) {
  if (id === this.reply.id) {
    this.liked = !this.liked;
  }
}

checkIfReplyDisliked(id: number) {
  if (id === this.reply.id) {
    this.disliked = !this.disliked;
  }
}

getCommentUsername(id: number) {
  this.memeService.getCommentUsername(id).subscribe(response => {
    this.username = response;
  });
}

initializeUploader() {
  let maxFileSize = 10 * 1024 * 1024;
  this.uploader = new FileUploader({
    url: this.baseUrl + 'memes/add-reply-with-image/' + this.comment.id,
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
    file.file.name = this.replyForm.value.content;
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

  addQuotedReply() {
    this.replyQuote = !this.replyQuote;
    this.initializeQuoteForm();
  }

  initializeQuoteForm() {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.reply.memeId],
      quote: [this.reply.content],
      commentId: [this.reply.commentId],
      replyingToUser: [this.reply.replyingToUser],
      replyingToReplyId: [this.reply.id]
    })
  }

  editReplyToggle(commentId: number) {
    this.commentUpdate = !this.commentUpdate;
  }

  editReply() {
    this.memeService.updateReply(this.reply).subscribe(() => {
      this.editForm.reset(this.editForm.value);
      this.commentUpdate = !this.commentUpdate;
    })
  }

  getMemberMainMemes(username: string) {
    this.memeService.getMemberMainMemes(username).subscribe(memes => {
      this.mainMemes = memes;
    })
  }  

  checkIfUserWorthy(mainMemes: number) {
    return this.helperService.checkIfUserWorthy(mainMemes);
  }

}
