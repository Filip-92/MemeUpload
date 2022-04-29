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
      // temporary solution for incorrect timezone
      var newTime = Number(this.memes[0].uploaded.substring(11,13)) - 2;
      if(this.memes[0].uploaded.substring(0,1) || this.memes[0].uploaded.substring(5,6))
      this.memes[0].uploaded = this.memes[0].uploaded.replace((this.memes[0].uploaded.substring(11,13)), newTime.toString());

      if (this.memes[0].url.includes("youtube")) {
        this.trustedUrl = this.formatYoutubeLink(this.memes[0].url)
      }
    })
  }

  changeTimeZone(date: string) {
    var newTime = Number(date.substring(11,13)) + 2;
    date.replace((date.substring(11,13)), newTime.toString())
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
