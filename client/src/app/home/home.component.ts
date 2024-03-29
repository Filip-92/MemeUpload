import { Component, OnInit, Input, NgModule, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
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
import * as watermark from 'watermarkjs';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  @ViewChild('previewimage') waterMarkImage: ElementRef;
  model: any = {}
  user: User;
  users: any;
  memeUploadMode = false;
  isLoggedIn = false;


  blobImage = null;

  constructor(public accountService: AccountService, private http: HttpClient, public router: Router) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
  }

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube.com/embed/" + id;
  }

  addWatermark() {
    fetch('https://memegenerator.net/img/images/14687350.jpg')
    .then(res => res.blob())
    .then(blob => {
      this.blobImage = blob;
    });
    watermark([this.blobImage, '././assets/logo (gimp - new).png'])
      .image(watermark.image.lowerRight(0.6))
      .then(img => {
        this.waterMarkImage.nativeElement.src = img.src;
      });
  }


}
