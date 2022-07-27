import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { MemeService } from 'src/app/_services/meme.service';
import { Location } from '@angular/common';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-meme-search',
  templateUrl: './meme-search.component.html',
  styleUrls: ['./meme-search.component.css']
})
export class MemeSearchComponent implements OnInit {

  constructor(private memeService: MemeService, private fb: FormBuilder, private location: Location,
    private memberService: MembersService, public accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
     }

  pagination: Pagination;
  pageNumber = 0;
  pageSize = 8;
  memes: Meme[];
  members: Member[];
  memeSearchForm: FormGroup;
  memberSearchForm: FormGroup;
  searchString: string;
  searchActive: boolean;
  trustedUrl: any;
  user: User;

  ngOnInit(): void {
    this.initializeMemeForm();
    this.initializeMemberForm();
    // if (this.pageNumber > 1) {
    //   this.pageNumber = +this?.route?.snapshot?.paramMap?.get('pageNumber');
    // }
  }

  initializeMemeForm() {
    this.memeSearchForm= this.fb.group({
      searchString: [''],
      type: ['All']
    })
  }

  initializeMemberForm() {
    this.memberSearchForm= this.fb.group({
      searchString: ['']
    })
  }

  searchForMeme(searchString: string) {
    this.memeService.searchForMeme(searchString.toLowerCase(), this.memeSearchForm.value.type, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
      if (this.pageNumber === 0) {
        //this.location.replaceState("szukaj/memes/" + searchString);
      }
      this.searchActive = true;
    });
  }

  searchForMember(searchString: string) {
    this.memberService.searchForMember(searchString.toLowerCase(), this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      console.log(this.members);
      this.pagination = response.pagination;
      if (this.pageNumber === 0) {
        //this.location.replaceState("szukaj/uzytkownicy/" + searchString);
      }
      this.searchActive = true;
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.searchForMeme(this.memeSearchForm.value?.searchString);
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.searchForMeme(this.memeSearchForm.value?.searchString);
  }

}
