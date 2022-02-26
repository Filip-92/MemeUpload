import { Component, OnInit, Input, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from 'src/app/_models/member';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { MembersService } from 'src/app/_services/members.service';
import { Meme } from '../_models/meme';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemeUploadComponent } from '../memes/meme-upload/meme-upload.component';
import { Photo } from '../_models/photo';
import { UserParams } from '../_models/userParams';
import { Pagination } from '../_models/pagination';
import { MemeService } from '../_services/meme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @Input() member: Member = {
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
    likes: 0
  };
  members: Member[];
  memes: Meme[];
  photos: Photo[];
  model: any = {}
  uploader: FileUploader;
  baseUrl = environment.apiUrl;
  user: User;
  users: any;
  registerMode = false;
  memeUploadMode = false;
  likes: number = 0;
  isLoggedIn = false;
  userParams: UserParams;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  meme: Meme;

  constructor(public accountService: AccountService, private memberService: MembersService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private http: HttpClient, private memeService: MemeService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMeme();
    this.getUsers();
    //this.getMemes();
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    })
  }

  getMemes() {
    for (let member of this.users) {
      for (let meme of member.memes) {
        this.memes += meme;
        console.log(this.memes.length);
      }
    }
  }

  addLike() {
    this.likes++;
  }

  removeLike() {
    this.likes--;
  }

  memeToggle() {
        this.memeUploadMode = !this.memeUploadMode;
    }

  // loadMemes() {
  //   this.loading = true;
  //   this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
  //     this.memes = response.result;
  //     this.pagination = response.pagination;
  //     this.loading = false;
  //   })
  // }

  loadMeme() {
    for (let meme of this.member.memes)
    this.memeService.getMeme(+this.route.snapshot.paramMap.get('id')).subscribe(member => {
      this.meme = meme;
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    //this.loadMessages();
  }
}
