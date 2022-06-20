import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { Photo } from 'src/app/_models/photo';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;
  members: Partial<Member[]>;
  photos: Photo[];
  liked: boolean;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;
  photo: Photo;
  url: string;

  constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presence: PresenceService) { }

  ngOnInit(): void {
    this.deletePhotos();
    // this.loadLikes(this.member.id);
    this.loadLikes();
    this.getUserPhoto(this.member.id);
  }
  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.liked = !this.liked;
    })
  }

  deletePhotos() {
    this.member.photos?.forEach(p => {
      if (!p.isMain) {
        this.memberService.deletePhoto(p.id).subscribe(() => {
          this.member.photos = this.member.photos.filter(x => x.id !== p.id);
        })
      }
    })
  }

  checkIfUserLiked(members: Partial<Member[]>) {
    for (var user of members) {
      console.log(members);
      if (user.id === this.member.id) {
        this.liked = !this.liked;
      }
    }
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response => {
      this.members = response.result;
      this.checkIfUserLiked(this.members);
      this.pagination = response.pagination;
    })
  }

  // loadLikes(userId: number) {
  //   this.memberService.getAllUserLikes(userId).subscribe(members => {
  //     this.checkIfUserLiked(this.members);
  //     this.members = members;
  //   })
  // }

  getUserPhoto(id: number) {
    this.memberService.getUserPhoto(id).subscribe(photo => {
      this.url = photo?.url;
    })
  }
}