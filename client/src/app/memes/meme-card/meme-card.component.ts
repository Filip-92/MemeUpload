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

  timeago

  ngOnInit(): void {
    this.getUsers();
    // temporary solution for incorrect timezone
    var newTime = Number(this.meme.uploaded.substring(11,13)) - 2;
    this.meme.uploaded = this.meme.uploaded.replace((this.meme.uploaded.substring(11,13)), newTime.toString());
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
}