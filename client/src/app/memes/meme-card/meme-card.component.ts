import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
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

  constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presence: PresenceService, private memeService: MemeService) { }

  ngOnInit(): void {
  }
  addLike(meme: Meme) {
    this.memberService.addLike(meme.url).subscribe();
  }
}