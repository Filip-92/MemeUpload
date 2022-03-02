import { Component, OnInit, Input, Output, EventEmitter, Self } from '@angular/core';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { clear } from 'console';
import { MemeService } from 'src/app/_services/meme.service';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-meme-upload',
  templateUrl: './meme-upload.component.html',
  styleUrls: ['./meme-upload.component.css']
})
export class MemeUploadComponent implements OnInit {
  // @Output() public onUploadFinished = new EventEmitter();
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
  public progress: number;
  public message: string;
  memeUploadForm: FormGroup;
  members: Member[];
  meme: Meme = {
    x: '',
    id: 0,
    url: '',
    title: '',
    uploaded: undefined,
    description: '',
    isApproved: false
  };
  model: any = {}
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;
  memeUploadMode = false;
  likes: number = 0;
  isLoggedIn = false;
  validationErrors: string[] = [];
  previewImg: SafeUrl;

  constructor(public accountService: AccountService, private memberService: MembersService,
    private router: Router, private toastr: ToastrService, private sanitizer: DomSanitizer,
    private fb: FormBuilder, private memeService: MemeService, private http: HttpClient) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    if (this.accountService.currentUser$ !== null) { // trzeba to ogarnac
      this.initializeUploader();
    }
    this.initializeForm();
  }

  initializeForm() {
    this.memeUploadForm = this.fb.group({
      title: ['', 
              [Validators.required, 
              Validators.minLength(8), 
              Validators.maxLength(32)]],
    })
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
    const formData = new FormData();
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-meme',
      additionalParameter: {
        title: this?.memeUploadForm?.value?.title
      },
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      this.previewImg = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      file.file.name = this.memeUploadForm.value.title;
      file.formData = this.memeUploadForm.value.title;
      formData.append('file', this.memeUploadForm.value.title);
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const meme: Meme = JSON.parse(response);
        console.log(response);
           this.accountService.setCurrentUser(this.user);
           this.previewImg = null;
           this.toastr.success('Pomyślnie dodano mema');
           this.memeToggle();
      }
    }
  }

    addMemeTitle() {
      this.memeService.addMemeTitle(this.memeUploadForm.value.title).subscribe(() => {})
    }

    memeToggle() {
        this.memeUploadMode = !this.memeUploadMode;
    }

    public get() {
      let bar = this.memeUploadForm.value.title;
      this.http.post(this.baseUrl + 'users/add-meme', '=' + bar, { 
          headers: new HttpHeaders({ 
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' 
          }) 
      })
    }

    writeValue(obj: any): void {
    }
    registerOnChange(fn: any): void {
    }
    registerOnTouched(fn: any): void {
    }
}