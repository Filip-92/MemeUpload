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
    // this.getMemes();
  }

  // getMemes() {
  //   this.memeService.getMemes().subscribe(memes => {
  //     this.memes = memes;
  //   })
  // }

  // getMemes() {
  //   this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
  //     this.memes = response.result;
  //     this.pagination = response.pagination;
  //   });
  // }

  addLike() {
    this.likes++;
  }

  removeLike() {
    this.likes--;
  }

}
