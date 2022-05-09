import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Pagination } from 'src/app/_models/pagination';
import { Router } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  @ViewChild('changePasswordForm') changePasswordForm: NgForm;
  @ViewChild('scrollMe') meme : ElementRef;
  model: any = {};
  scrolltop:number=null;
  member: Member;
  user: User;
  members: Partial<Member[]>;
  predicate = 'likedBy';
  pageNumber = 1;
  pageSize = 8;
  pagination: Pagination;
  memes: Meme[];
  
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, private memberService: MembersService, 
    private toastr: ToastrService, private router: Router, private memeService: MemeService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
    this.loadLikes();
    this.getMemberMemes(this.user.username);
  }

  getMemberMemes(username: string) {
    this.memeService.getMemberMemes(username, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    })
  }

  changePassword() {
    this.accountService.changePassword(this.model).subscribe(() => {
      this.toastr.success('Password changed successfully');
      this.changePasswordForm.reset(this.member);
    })
  }

  loadMember() {
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member;
    })
  }

  updateMember() {
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Profile updated successfully');
      this.editForm.reset(this.member);
    })
  }

  openNav() {
    document.getElementById("mySidepanel").style.width = "250px";
  }
  
  /* Set the width of the sidebar to 0 (hide it) */
  closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  changeDateFormat(date: string) {
    var newDate = date.substring(0,10);
    return newDate;
  }

  removeMeme(memeId) {
    this.memeService.removeMeme(memeId).subscribe(() => {
      this.memes.splice(this.memes.findIndex(p => p.id === memeId), 1);
    })
  }

  deleteMeme(memeId: number) {
    this.memberService.deleteMeme(memeId).subscribe(() => {
      this.member.memes = this.member.memes.filter(x => x.id !== memeId);
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.getMemberMemes(this.user.username);
  }
}