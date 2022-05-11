import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/_models/pagination';
import { DatePipe } from '@angular/common';
import { Meme } from 'src/app/_models/meme';
import { MemeService } from 'src/app/_services/meme.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})

export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  member: Member = {
    memes: [],
    memeUrl: '',
    id: 0,
    username: '',
    photoUrl: '',
    age: 0,
    created: undefined,
    lastActive: undefined,
    gender: '',
    photos: [],
    numberOflikes: 0
  };
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;
  users: any;
  members: Partial<Member[]>;
  predicate = 'likedBy';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;
  @ViewChild('scrollMe') meme : ElementRef;
  scrolltop: number=null;
  memes: Meme[];
  userId: number;

  constructor(public presence: PresenceService, private route: ActivatedRoute, 
    private messageService: MessageService, private accountService: AccountService,
    private router: Router, private memberService: MembersService, private http: HttpClient, 
    private toastr: ToastrService, public datepipe: DatePipe, private memeService: MemeService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
      console.log(this.member);
    })
    this.getUsers();
    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
    this.galleryImages = this.getImages();
    this.loadLikes();
    this.getMemberMemes(this.member.username);
    // this.member.likes = this.getLikes(this.member);
  }
  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }
  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }
  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }
  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  changeDateFormat(date: string) {
    var newDate = date.substring(0,10);
    return newDate;
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success('You have liked ' + member.username);
      // this.member.likes++;
    })
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  getMemberMemes(username: string) {
    this.memeService.getMemberMemes(username, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.getMemberMemes(this.user.username);
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(response => {
      this.users = response;
      for(let user of this.users){
      if (user.username == this.member.username) {
        this.userId = user.id;
      }
    }
    }, error => {
      console.log(error);
    })
  }
}