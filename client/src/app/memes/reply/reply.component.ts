import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Reply } from 'src/app/_models/reply';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  @Input() reply: Reply;
  user: User;
  url: string;
  replyField: boolean;
  replyForm: FormGroup;
  validationErrors: any;
  liked: boolean;
  disliked: boolean;
  likedReplies: any;
  username: any;

  constructor(public accountService: AccountService, private memeService: MemeService,
    private fb: FormBuilder, private toastr: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.getUserPhoto(this.reply.username);
    if ("user" in localStorage) {
      this.loadLikes();
    }
    //this.getCommentUsername(this.reply.commentId);
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
  }

  addReply(commentId) {
    this.replyField = !this.replyField;
    this.initializeForm(commentId)
  }

  initializeForm(commentId) {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.reply.memeId],
      commentId: [commentId]
    })
  }

  replyComment() {
    this.memeService.addReply(this.replyForm.value).subscribe(response => {
      this.toastr.success('Pomyślnie dodano odpowiedź');
      this.replyForm.reset();
      this.replyField = !this.replyField;
      }, error => {
      this.validationErrors = error;
    })
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
    console.log(this.username);
  });
}

}
