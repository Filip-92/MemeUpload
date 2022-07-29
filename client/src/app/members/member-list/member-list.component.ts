import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { Pagination } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  loggedIn: boolean;
  genderList = [{ value: 'male', display: 'Mężczyźni' }, { value: 'female', display: 'Kobiety' }, { value: 'other', display: 'Helikoptery bojowe'}];
  account: AccountService;

  constructor(private memberService: MembersService, private accountService: AccountService, private router: Router, private toastr: ToastrService) {
    this.userParams = this.memberService.getUserParams();
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    if ("user" in localStorage) {
      this.loadMembers();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  requiresLogin() {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if (user) return true;
        this.toastr.error('You shall not pass!')
        return false;
      })
    )
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}