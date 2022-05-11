import { Component, OnInit, Input, NgModule, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from 'src/app/_models/member';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { Meme } from '../_models/meme';
import { Photo } from '../_models/photo';
import { UserParams } from '../_models/userParams';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { MemeService } from '../_services/meme.service';
import { Router } from '@angular/router';

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
    numberOflikes: 0
  };
  members: Member[];
  memes: Meme[];
  photos: Photo[];
  model: any = {}
  user: User;
  users: any;
  memeUploadMode = false;
  isLoggedIn = false;
  meme: Meme = {
    x: '',
    id: 0,
    url: '',
    title: '',
    uploaded: undefined,
    description: '',
    isApproved: false,
    likes: 0
  };

  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;

  constructor(public accountService: AccountService, private router: Router, private http: HttpClient, 
    private memeService: MemeService, private cdRef:ChangeDetectorRef) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    })
  }

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube.com/embed/" + id;
    console.log(url)
  }
}
