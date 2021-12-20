import { Component, OnInit, Input } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { MembersService } from 'src/app/_services/members.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Meme } from 'src/app/_models/meme';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { clear } from 'console';

@Component({
  selector: 'app-meme-upload',
  templateUrl: './meme-upload.component.html',
  styleUrls: ['./meme-upload.component.css']
})
export class MemeUploadComponent implements OnInit {
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
  memeUploadForm: FormGroup;
  members: Member[];
  meme: Meme = {
    x: '',
    id: 0,
    url: '',
    title: '',
    description: '',
    isApproved: false
  };
  model: any = {}
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;
  registerMode = false;
  memeUploadMode = false;
  likes: number = 0;
  isLoggedIn = false;
  validationErrors: string[] = [];
  previewImg: SafeUrl;

  constructor(public accountService: AccountService, private memberService: MembersService,
    private router: Router, private toastr: ToastrService, private sanitizer: DomSanitizer) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    if (this.accountService.currentUser$ !== null) { // trzeba to ogarnac
      this.initializeUploader();
    }
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
          this.meme.url = meme.url;
          this.meme.title = meme.title;
          console.log(this.meme.title);
           this.user.memeUrl = meme.url;
           this.member.memeUrl = meme.url;
           this.accountService.setCurrentUser(this.user);
           this.previewImg = null;
           this.toastr.success('Pomyślnie dodano mema');
      }
    }

    this.uploader.onAfterAddingFile = (file) => {
      console.log('***** onAfterAddingFile ******')
      this.previewImg = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));;
    }
  }

    memeToggle() {
        this.memeUploadMode = !this.memeUploadMode;
    }
}