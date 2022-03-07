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
    likes: 0
  };
  members: Member[];
  memes: Meme[];
  photos: Photo[];
  model: any = {}
  user: User;
  users: any;
  memeUploadMode = false;
  isLoggedIn = false;
  memeArray = [];
  meme: Meme[];
  randomId = 43;
  number = Math.floor(Math.random() * 10) + 1;

  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;

  constructor(public accountService: AccountService, private router: Router, private http: HttpClient, 
    private memeService: MemeService, private cdRef:ChangeDetectorRef) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.getUsers();
    // this.getMemes();
    //this.loadMemes();
    //this.getRandomId();
    this.randomId = this.getRandomMeme();
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    })
  }

  // getMemes() {
  //   this.memeService.getMemes().subscribe(memes => {
  //     this.memes = memes;
  //   })
  // }

  getRandomMeme() {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    for (let meme of this.memes) {
      this.memeArray.push(meme.id);
    }
    var item = this.memeArray[Math.floor(Math.random()*this.memeArray.length)];
    this.memeArray = [];
    return item;
  }


  // loadMemes() {
  //   this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
  //     this.memes = response.result;
  //     this.pagination = response.pagination;
  //     return this.memes;
  //   });
  // }

  // getRandomId() {
  //   this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
  //     this.memes = response.result;
  //     for (let meme of this.memes) {
  //       this.memeArray.push(meme.id);
  //     }
  //     var item = this.memeArray[Math.floor(Math.random()*this.memeArray.length)];
  //     this.memeArray = [];
  //     console.log(item);
  //     return item;
  //   });
  // }
}
