import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-detail',
  templateUrl: './meme-detail.component.html',
  styleUrls: ['./meme-detail.component.css']
})
export class MemeDetailComponent implements OnInit {

  meme: Meme;
  memes: Meme[];
  members: Member;
  users: any;
  id: number = +this.route.snapshot.paramMap.get('id');
  likes: number = 0;

  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  trustedUrl: any;

  constructor(private memeService: MemeService, private http: HttpClient,
    private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.meme = data.meme;
    });
    this.getMeme(this.id);
  }

  getMeme(memeId: number) {
    this.memeService.getMeme(memeId).subscribe(memes => {
      this.memes = memes.reverse();
      if (this.memes[0].url.includes("youtube")) {
        this.trustedUrl = this.formatYoutubeLink(this.memes[0].url)
      }
    })
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

  addLike() {
    this.likes++;
  }

  removeLike() {
    this.likes--;
  }

  checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  onErrorFunction() {
    this.toastr.error("Adres url jest zjebany!")
  }

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

}
