import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-detail',
  templateUrl: './meme-detail.component.html',
  styleUrls: ['./meme-detail.component.css']
})
export class MemeDetailComponent implements OnInit {

  meme: Meme;
  memes: Meme[];
  members: Member;
  users: any;
  id: number = +this.route.snapshot.paramMap.get('id');
  likes: number = 0;

  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;

  constructor(private memeService: MemeService, private http: HttpClient,
                private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.meme = data.meme;
    });
    this.getMeme(this.id);
  }

  getMemes() {
    this.memeService.getAllMemes().subscribe(memes => {
      this.memes = memes.reverse();
    })
  }

  getMeme(memeId: number) {
    this.memeService.getMeme(memeId).subscribe(memes => {
      this.memes = memes.reverse();
    })
  }

  addLike() {
    this.likes++;
  }

  removeLike() {
    this.likes--;
  }

}
