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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { clear } from 'console';
import { MemeService } from 'src/app/_services/meme.service';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { isNgTemplate } from '@angular/compiler';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AboutModalComponent } from 'src/app/modals/about-modal/about-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    isApproved: false,
    likes: 0
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
  format;

  constructor(public accountService: AccountService, private memberService: MembersService,
    private router: Router, private toastr: ToastrService, private sanitizer: DomSanitizer,
    private fb: FormBuilder, private memeService: MemeService, private http: HttpClient,
    private modalService: NgbModal) { 
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
      description: ['', [Validators.maxLength(400)]]
    })
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  } 

  initializeUploader() {
    let maxFileSize = 10 * 1024 * 1024;
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-meme',
      authToken: 'Bearer ' + this.user.token,
      allowedFileType: ['image'],
      isHTML5: true,
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: maxFileSize
    });

    this.uploader.onWhenAddingFileFailed = (item, filter) => {
      let message = '';
      switch (filter.name) {
        case 'fileSize':
          message = 'Plik jest za duży. Rozmiar pliku to ' + this.formatBytes(item.size) + ', podczas gdy maksymalny dopuszczalny rozmiar to ' + this.formatBytes(maxFileSize);
          break;
        default:
          message = 'Wystąpił błąd';
          break;
      }
    
      this.toastr.warning(message);
    };

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      if(file._file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file._file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      this.previewImg = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      file.file.name = this.memeUploadForm.value.title;
      file.file.type = this.memeUploadForm.value.description;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const meme: Meme = JSON.parse(response);
           this.accountService.setCurrentUser(this.user);
           this.previewImg = null;
           this.toastr.success('Pomyślnie dodano mema');
           this.memeUploadForm.value.title = null;
           this.memeUploadForm.value.description = null;
           this.memeToggle();
      }
    }
  }

  open(content) {
    this.modalService.open(content);
  }

  private formatBytes(bytes, decimals?) {
    if (bytes == 0) return '0 Bytes';
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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

}