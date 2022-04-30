import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { MemeService } from 'src/app/_services/meme.service';
import { PresenceService } from 'src/app/_services/presence.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-meme-card',
  templateUrl: './meme-card.component.html',
  styleUrls: ['./meme-card.component.css'],
})
export class MemeCardComponent implements OnInit, PipeTransform {
  @Input() member: Member;
  @Input() meme: Meme;
  likes: number = 0;
  users: any;
  user: User;
  memes: Meme[];
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  format;
  trustedUrl: any;

  constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presence: PresenceService, private memeService: MemeService, private http: HttpClient,
    public sanitizer: DomSanitizer) { }
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getUsers();
    // temporary solution for incorrect timezone
    var newTime = Number(this.meme.uploaded.substring(11,13)) - 2;
    this.meme.uploaded = this.meme.uploaded.replace((this.meme.uploaded.substring(11,14)), newTime.toString() + ":");
    if(this.meme.url.includes("youtube")) {
      this.trustedUrl = this.formatYoutubeLink(this.meme.url);
    }
  }
  
  // addLike(meme: Meme) {
  //   this.memberService.addLike(meme.url).subscribe();
  // }

  addLike(meme: Meme) {
    // this.memeService.addLike(meme.id).subscribe(() => {
    //   //this.toastr.success('You have liked ' + member.username);
    // })
    this.likes++;
  }

  removeLike() {
    this.likes--;
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    })
  }

  replaceTitle(title: string) {
    title.replace(" ", "-");
  }

  convertText(title: string) {
    var result = title?.toLowerCase().split(' ').join('-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return result;
  }

  checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

  changeTimeZone(uploadedDate: string) {
    var time = Number(uploadedDate.substring(11,13));
    var day = Number(uploadedDate.substring(9,10));
    var newTime = time - 2;
    if (time >= 2) {
      if (time > 10) {
        uploadedDate = uploadedDate.replace((uploadedDate.substring(11,14)), newTime.toString() + ":");
      } else {
        uploadedDate = uploadedDate.replace((uploadedDate.substring(11,14)), "0" + newTime.toString() + ":");
      }
    } else if (time === 1) {
      var newDay = day - 1;
      newTime = 23;
      if (Number(uploadedDate.substring(5,7)) > 1) {
        uploadedDate = this.adjustDay(uploadedDate, newTime, newDay);
      } else {
        uploadedDate = this.adjustDay(uploadedDate, newTime, newDay);
        uploadedDate = this.adjustYear(uploadedDate);
      }
    } else if (time === 0) {
      var newDay = day - 1;
      newTime = 22;
      uploadedDate = this.adjustDay(uploadedDate, newTime, newDay);
    }
    return uploadedDate
  }

  adjustDay(uploadedDate: string, newTime: number, newDay: number) {
    if (Number(uploadedDate.substring(9,10)) > 1) {
      uploadedDate = uploadedDate.replace((uploadedDate.substring(11,14)), newTime.toString() + ":");
      uploadedDate = uploadedDate.replace((uploadedDate.substring(9,11)), newDay.toString() + "T");
    } else if (Number(uploadedDate.substring(9,10)) === 1) {
      newDay = 31;
      var newMonth = Number(uploadedDate.substring(5,7)) - 1;
      uploadedDate = uploadedDate.replace((uploadedDate.substring(11,14)), newTime.toString() + ":");
      uploadedDate = uploadedDate.replace((uploadedDate.substring(8,11)), newDay.toString() + "T");
      uploadedDate = uploadedDate.replace((uploadedDate.substring(4,8)), "-0" + newMonth.toString() + "-");
      var month = Number(uploadedDate.substring(5,7));
      if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {         
        newDay = 31;
      } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        newDay = 30;
      } else if (month === 2) {
        newDay = this.checkLeapYear(uploadedDate);
      }
      uploadedDate = uploadedDate.replace((uploadedDate.substring(8,11)), newDay.toString() + "T");
    }
    return uploadedDate;
  }

  adjustYear(uploadedDate: string) {
    var newYear = Number(uploadedDate.substring(0,4)) - 1;
    uploadedDate = uploadedDate.replace(uploadedDate.substring(4,8), "-" + 12 + "-");
    uploadedDate = uploadedDate.replace(uploadedDate.substring(0,5), newYear.toString() + "-");
    return uploadedDate;
  }

  checkLeapYear(uploadedDate: string) {
    var year = Number(uploadedDate.substring(0,4));
    var day = 28;
    if ((year%4 === 0 && year%100 !== 0) || year%400 === 0) {
      day = 29;
    } else {
      day = 28;
    }
    return day;
  }
}