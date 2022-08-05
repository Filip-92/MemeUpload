import { Component, OnInit, Input } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { MembersService } from 'src/app/_services/members.service';
import { Photo } from 'src/app/_models/photo';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MemeService } from 'src/app/_services/meme.service';
import { MemberEditComponent } from '../member-edit/member-edit.component';

@Component({
  selector: 'app-photo-editor-base64',
  templateUrl: './photo-editor-base64.component.html',
  styleUrls: ['./photo-editor-base64.component.css']
})
export class PhotoEditorBase64Component implements OnInit {
  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;
  previewImg: SafeUrl;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropMode: boolean;
  format: any;
  updatePhotoForm: UntypedFormGroup;
  validationErrors: any;
  url: string;
  id: number;

  constructor(private accountService: AccountService, private memberService: MembersService, private sanitizer: DomSanitizer,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private memeService: MemeService, 
    private memberEdit: MemberEditComponent) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploader();
    this.initializeForm();
    if (this.member?.photos?.length > 0) {
      this.deletePhotos();
    }
  }

  getUserPhoto(username: string) {
    this.memeService.getUserPhoto(username).subscribe(photo => {
      this.url = photo?.url;
      this.id = photo?.id;
      if (this.id !== null) {
        this.deletePhoto(this.id)
      }
    })
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  initializeForm() {
    this.updatePhotoForm = this.fb.group({
      url: [''],
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member?.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id === photo.id) p.isMain = true;
      })
    })
  } 

  addPhoto() {
    this.deletePhotos();
    this.memberService.addPhoto(this.updatePhotoForm?.value).subscribe(response => {
      this.toastr.success('Pomyślnie dodano zdjęcie');
      this.updatePhotoForm.reset();
      // this.memberEdit.getUserPhoto(this.user.username);
      this.previewImg = null;
      this.uploader?.clearQueue();
      }, error => {
      this.validationErrors = error;
    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);
    })
  }

  deletePhotos() {
    this.member.photos.forEach(p => {
      this.memberService.deletePhoto(p.id).subscribe(() => {
        this.member.photos = this.member.photos.filter(x => x.id !== p.id);
      })
    })
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
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
        const photo: Photo = JSON.parse(response);
        this.member.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        })
        this.member.photos.push(photo);
        this.setMainPhoto(photo);
         if (photo.isMain) {
           this.user.photoUrl = photo.url;
           this.member.photoUrl = photo.url;
           this.accountService.setCurrentUser(this.user);
         }
         this.previewImg = null; 
      }
    }

    this.uploader.onAfterAddingFile = (file) => {
      this.previewImg = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      if(file._file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file._file.type.indexOf('video') > -1) {
        this.format = 'video';
      } 
    }
  }

  open(content: any) {
    this.modalService.open(content);
  }

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;

  // fileChangeEvent(event: any): void {
  //   this.imageChangedEvent = event;
  // }

  fileChangeEvent(fileInput: any) {
    this.imageChangedEvent = fileInput;
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';

            return false;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    this.updatePhotoForm.value.url = this.cardImageBase64;
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
}

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.previewImg = this.croppedImage;
      this.updatePhotoForm.value.url = this.croppedImage;
  }
  imageLoaded(image: LoadedImage) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show messa

  }
}
