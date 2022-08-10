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
import { Reply } from 'src/app/_models/reply';
import { environment } from 'src/environments/environment';
import { AdminService } from 'src/app/_services/admin.service';

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
    comments: [],
    numberOflikes: 0
  };
  userWithLikes: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;
  users: any;
  members: Partial<Member[]>;
  predicate = 'liked';
  pageNumber = 0;
  pageSize = 5;
  pagination: Pagination;
  @ViewChild('scrollMe') meme : ElementRef;
  scrolltop: number=null;
  memes: Meme[];
  userId: number;
  comments: Comment[];
  replies: Reply[];
  numberOfLikes: number = 0;
  liked: boolean = false;
  mainMemes: number = 0;
  url: string;

  constructor(public presence: PresenceService, private route: ActivatedRoute, 
    private messageService: MessageService, private accountService: AccountService,
    private router: Router, private memberService: MembersService, private http: HttpClient, 
    private toastr: ToastrService, public datepipe: DatePipe, private memeService: MemeService,
    private adminService: AdminService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
      if (this.member.username === this.user.username) {
        window.location.replace('uzytkownik/edycja');
      }
    })
    if ("user" in localStorage) {
      this.getUsers();
      this.loadLikes();
      if (this.member.id !== 11) {
        this.getUserPhoto(this.member.id);
      } else {
        this.url = '././assets/LogoImage.png';
      }
      this.route?.queryParams?.subscribe(params => {
        params?.tab ? this.selectTab(params?.tab) : this.selectTab(0);
      })
      this.galleryImages = this.getImages();
      this.getMemberMemes(this.member.username);
      this.getMemberComments(this.member.username);
      this.getMemberReplies(this.member.username);
      this.getMemberNumberOfLikes(this.member.username);
      this.getMemberMainMemes(this.member.username);
    } else {
      this.toastr.warning("Zaloguj się aby mieć dostęp");
      this.router.navigateByUrl('/');
    }
  }

  getUserPhoto(id: number) {
    this.memberService.getUserPhoto(id).subscribe(photo => {
      this.url = photo?.url;
    })
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
    if (this.activeTab?.heading === 'Messages' && this.messages?.length === 0) {
      this.messageService.createHubConnection(this.user, this.member?.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  changeDateFormat(date) {
    var newDate = date.substring(0,10);
    return newDate;
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.liked = !this.liked;
      if(this.liked) {
        this.numberOfLikes++;
        this.liked = true;
      } else {
        this.numberOfLikes--;
        this.liked = false;
      }
    })
  }

  checkIfUserLiked(members: Partial<Member[]>) {
    for (var user of members) {
      if (user.id === this.member.id) {
        this.liked = true;
      }
    }
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.checkIfUserLiked(this.members);
      this.pagination = response.pagination;
    })
  }

  getMemberMemes(username: string) {
    this.memeService.getMemberMemes(username, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  getMemberMainMemes(username: string) {
    this.memeService.getMemberMainMemes(username).subscribe(memes => {
      this.mainMemes = memes;
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.getMemberMemes(this.user.username);
  }

  getUsers() {
    this.http.get(environment.apiUrl + 'users').subscribe(response => {
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

  getMemberComments(username: string) {
    this.memeService.getMemberComments(username).subscribe(comments => {
      this.comments = comments;
    });
  }

  getMemberReplies(username: string) {
    this.memeService.getMemberReplies(username).subscribe(replies => {
      this.replies = replies;
    });
  }

  getMemberNumberOfLikes(username: string) {
    this.memberService.getAllUserLikesNumber(username).subscribe(numberOfLikes => {
      this.numberOfLikes = numberOfLikes;
    })
  }

  genderToPolish(gender: string) {
    if (gender === 'male') {
      return 'Mężczyzna';
    } else if (gender === 'female') {
      return 'Kobieta';
    } else {
      return 'Helikopter bojowy';
    }
  }

  rejectMeme(memeId: number) {
    this.adminService.rejectMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }
}