import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Comment } from 'src/app/_models/comments';
import { Reply } from 'src/app/_models/reply';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemeService } from 'src/app/_services/meme.service';
import { MemeDetailComponent } from '../meme-detail/meme-detail.component';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  url: string;
  user: User;
  replyForm: FormGroup;
  editForm: FormGroup;
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

  constructor(private memeService: MemeService, public accountService: AccountService,
    private toastr: ToastrService, private fb: FormBuilder) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.logged = true;
  }
  

  ngOnInit(): void {
    this.getUserPhoto(this.comment.username);
    this.getReplies(this.comment.id);
    if ("user" in localStorage) {
      this.loadLikes();
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
    this.reloadCurrentPage();
  }

  reloadComments(comment) {
    this.memeDetail.getComments(comment.memeId);
  }

  replyComment() {
    this.memeService.addReply(this.replyForm.value).subscribe(response => {
      this.toastr.success('Pomyślnie dodano odpowiedź');
      this.replyForm.reset();
      this.getReplies(this.comment.id);
      this.reply = !this.reply;
      }, error => {
      this.validationErrors = error;
    })
  }

  addReply(commentId) {
    this.reply = !this.reply;
    this.initializeForm(commentId)
  }

  addQuotedReply(commentId) {
    this.replyQuote = !this.replyQuote;
    this.initializeQuoteForm(commentId)
  }

  initializeForm(commentId) {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.comment.memeId],
      commentId: [commentId]
    })
  }

  initializeQuoteForm(commentId) {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.comment.memeId],
      quote: [this.comment.content],
      commentId: [commentId]
    })
  }

  initializeEditForm(commentId) {
    this.editForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.comment.memeId],
      id: [commentId]
    })
  }

  getReplies(commentId: number) {
    this.memeService.getReplies(commentId).subscribe(replies => {
      this.replies = replies;
    });
  }

  addLike(comment: Comment) {
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

addDislike(comment: Comment) {
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
  this.initializeEditForm(commentId);
}

editComment(commentId: number) {
  this.memeService.updateComment(this.editForm.value, commentId).subscribe(() => {
    this.editForm.reset(this.editForm.value);
    this.commentUpdate = !this.commentUpdate;
  })
}

reloadCurrentPage() {
  window.setTimeout(function(){location.reload()},100);
 }

}
