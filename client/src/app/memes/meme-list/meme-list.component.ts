import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { User } from 'src/app/_models/user';
import { Meme } from 'src/app/_models/meme';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-list',
  templateUrl: './meme-list.component.html',
  styleUrls: ['./meme-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  meme: Meme[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;

  constructor(private memeService: MemeService) {
  }

  ngOnInit(): void {
    this.loadMemes();
  }

  loadMemes() {
    this.memeService.setUserParams(this.userParams);
    this.memeService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memeService.setUserParams(this.userParams);
    this.loadMemes();
  }
}