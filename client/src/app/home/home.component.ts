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
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemeUploadComponent } from '../memes/meme-upload/meme-upload.component';
import { Photo } from '../_models/photo';

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
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;
  registerMode = false;
  memeUploadMode = false;
  likes: number = 0;
  isLoggedIn = false;

  constructor(public accountService: AccountService, private memberService: MembersService,
    private router: Router, private toastr: ToastrService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  } 

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    })
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-meme',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const meme: Meme = JSON.parse(response);
        this.member.memes.push(meme);
        if(typeof(this.member.memes) === 'undefined')
           this.user.memeUrl = meme.url;
           this.member.memeUrl = meme.url;
           this.accountService.setCurrentUser(this.user);
           this.memeToggle();
      }
    }
  }


  // loadMembers() {
  //   this.memberService.setUserParams(this.userParams);
  //   this.memberService.getMembers(this.userParams).subscribe(response => {
  //     this.members = response.result;
  //     this.pagination = response.pagination;
  //   })
  // }
  addLike() {
    this.likes++;
  }

  removeLike() {
    this.likes--;
  }

  memeToggle() {
        this.memeUploadMode = !this.memeUploadMode;
    }
}
