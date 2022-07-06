import { Component, OnInit, Input, Output, EventEmitter, Self } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Meme } from 'src/app/_models/meme';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MemeService } from 'src/app/_services/meme.service';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { Division } from 'src/app/_models/division';

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
    comments: [],
    numberOflikes: 0
  };
  public progress: number;
  public message: string;
  memeUploadForm: FormGroup;
  youtubeForm: FormGroup;
  divisionForm: FormGroup;
  members: Member[];
  meme: Meme = {
    x: '',
    id: 0,
    url: '',
    title: '',
    uploaded: undefined,
    description: '',
    isApproved: false,
    numberOfLikes: 0,
    comments: undefined,
    division: 0
  };
  model: any = {};
  divisions: Division[];
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;
  memeUploadMode = false;
  likes: number = 0;
  isLoggedIn = false;
  validationErrors: string[] = [];
  previewImg: SafeUrl;
  format: string;
  normalMeme: boolean;
  youtubeVideo: boolean;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  openDivision: boolean = false;

  constructor(public accountService: AccountService, private toastr: ToastrService, 
    private sanitizer: DomSanitizer, private fb: FormBuilder, private memeService: MemeService, 
    private http: HttpClient, private modalService: NgbModal) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    if (this.accountService.currentUser$ !== null) { // trzeba to ogarnac
      this.initializeUploader();
    }
    this.initializeForm();
    this.getDivisions();
    this.initializeDivisionForm();
  }

  initializeForm() {
    this.memeUploadForm = this.fb.group({
      title: ['', 
              [Validators.required, 
              Validators.minLength(8), 
              Validators.maxLength(32),
              Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      description: ['', [Validators.maxLength(400)]]
    })
  }

  initializeDivisionForm() {
    this.divisionForm = this.fb.group({
      division: ['0']
    })
  }

  // Validators.pattern("^(?!\s*$)[-a-zA-Z0-9_:,.' ']{1,100}$")

  private regExHyperlink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  initializeYoutubeForm() {
    this.youtubeForm = this.fb.group({
      title: [this.memeUploadForm.value.title],
      url: ['', [Validators.required, Validators.pattern(this.regExHyperlink)]],
      description: ['', [Validators.maxLength(400)]],
      division: [this.divisionForm.value.division]
    })
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  } 

  initializeUploader() {
    let maxFileSize = 10 * 1024 * 1024;
    this.uploader = new FileUploader({
      url: this.baseUrl + 'memes/add-meme',
      authToken: 'Bearer ' + this.user.token,
      allowedFileType: ['image', 'video'],
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
      file.file.name = this.memeUploadForm.value.title + '^' + this.divisionForm.value.division + '^' + this.memeUploadForm.value.description;
      file.file.rawFile = this.croppedImage;
    }

    this.uploader.onSuccessItem = (item, response) => {
      if (response) {
        const meme: Meme = JSON.parse(response);
           this.accountService.setCurrentUser(this.user);
           this.previewImg = null;
           this.toastr.success('Pomyślnie dodano mema');
           this.memeUploadForm.reset();
           this.memeUploadForm.value.description = null;
           this.memeToggle();
      }
    }
  }

  open(content: any) {
    this.modalService.open(content);
  }

  private formatBytes(bytes: number, decimals?: number) {
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

  normalMemeToggle() {
    this.normalMeme = !this.normalMeme;
  }

  youtubeVideoToggle() {
    this.youtubeVideo = !this.youtubeVideo;
    this.initializeYoutubeForm();
  }

  addYoutubeLink() {
    this.memeService.addYoutubeLink(this.youtubeForm.value).subscribe(response => {
      this.memeToggle();
      this.toastr.success('Pomyślnie dodano link');
      this.memeUploadForm.reset();
      }, error => {
      this.validationErrors = error;
    })
  }
  closedDivisions: any;

  getDivisions() {
    this.memeService.getDivisions().subscribe(divisions => {
      this.divisions = divisions;
      // for (let division of this.divisions) {
      //   this.closedDivisions?.append(division.name);
      //   console.log(this.closedDivisions);
      // }
    });
  }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  public save() {
    const date: number = new Date().getTime();
    // Put the blob into the fileBits array of the File constructor
    const file = new File(this.croppedImage.blob, 'photo', {type: 'image/png', lastModified: date});
    const fileItem = new FileItem(this.uploader, file, {});
    this.uploader.queue.push(fileItem);
    fileItem.upload();
  }
  imageLoaded(image: LoadedImage) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
}