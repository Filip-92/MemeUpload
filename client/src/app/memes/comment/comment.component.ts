import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/_models/comments';
import { MemeService } from 'src/app/_services/meme.service';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  url: string;

  constructor(private memeService: MemeService) { }

  ngOnInit(): void {
    this.getUserPhoto(this.comment.username);
  }

  getUserPhoto(username: string) {
    this.memeService.getUserPhoto(username).subscribe(photo => {
      this.url = photo.url;
    })
  }

}
