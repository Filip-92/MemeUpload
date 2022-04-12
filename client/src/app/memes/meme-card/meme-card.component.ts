import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { MemeService } from 'src/app/_services/meme.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-meme-card',
  templateUrl: './meme-card.component.html',
  styleUrls: ['./meme-card.component.css'],
})
export class MemeCardComponent implements OnInit {
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

  constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presence: PresenceService, private memeService: MemeService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
    // this.getMemes();
  }
  // addLike(meme: Meme) {
  //   this.memberService.addLike(meme.url).subscribe();
  // }

  // getMemes() {
  //   this.memeService.getMemes().subscribe(memes => {
  //     this.memes = memes;
  //   })
  // }

  // getMemes() {
  //   this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
  //     this.memes = response.result;
  //     this.pagination = response.pagination;
  //   });
  // }

  addLike(meme: Meme) {
    this.memeService.addLike(meme.id).subscribe(() => {
      //this.toastr.success('You have liked ' + member.username);
      this.likes++;
    })
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
}