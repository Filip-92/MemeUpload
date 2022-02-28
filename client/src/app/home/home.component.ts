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
  memeArray = [];
  meme: Meme[];

  constructor(public accountService: AccountService, private memberService: MembersService, private route: ActivatedRoute,
    private router: Router, private toastr: ToastrService, private http: HttpClient, private memeService: MemeService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.getUsers();
    this.getMemes();
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    })
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

  getMemes() {
      this.memeService.getMemes().subscribe(memes => {
        this.memes = memes;
      })
    }

  getRandomMeme() {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    for (let meme of this.memes) {
      this.memeArray.push(meme.id);
    }
    console.log(this.memeArray);
    var item = this.memeArray[Math.floor(Math.random()*this.memeArray.length)];
    this.memeArray = [];
    return item;
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    //this.loadMessages();
  }
}
