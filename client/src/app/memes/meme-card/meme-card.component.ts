import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
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

  constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presence: PresenceService, private memeService: MemeService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
  }
  // addLike(meme: Meme) {
  //   this.memberService.addLike(meme.url).subscribe();
  // }

  addLike() {
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
}