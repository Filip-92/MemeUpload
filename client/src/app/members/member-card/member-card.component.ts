import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { Photo } from 'src/app/_models/photo';
import { Reply } from 'src/app/_models/reply';
import { MembersService } from 'src/app/_services/members.service';
import { MemeService } from 'src/app/_services/meme.service';
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
  pageNumber = 0;
  pageSize = 5;
  pagination: Pagination;
  photo: Photo;
  url: string;
  comments: Comment[];
  replies: Reply[];
  numberOfLikes: number;
  mainMemes: number;
  memes: any;

  constructor(private memberService: MembersService, private toastr: ToastrService, 
    public presence: PresenceService, private memeService: MemeService) { }

  ngOnInit(): void {
    this.loadLikes();
        if (this.member.id !== 11) {
      this.getUserPhoto(this.member.id);
    } else {
      this.url = '././assets/LogoImage.png';
    }
    this.getMemberReplies(this.member.username);
    this.getMemberComments(this.member.username);
    this.getMemberNumberOfLikes(this.member.username);
    this.getMemberMemes(this.member.username);
    this.getMemberMainMemes(this.member.username);
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.liked = !this.liked;
      if(this.liked) {
        this.numberOfLikes++;
        this.liked = true;
      } else {
        this.numberOfLikes--;
        this.liked = false;
      }
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
    console.log(members);
    for (var user of members) {
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

  changeDateFormat(date) {
    var newDate = date.substring(0,10);
    return newDate;
  }

  getMemberMainMemes(username: string) {
    this.memeService.getMemberMainMemes(username).subscribe(memes => {
      this.mainMemes = memes;
    })
  }

  getMemberMemes(username: string) {
    this.memeService.getMemberMemes(username, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  getMemberComments(username: string) {
    this.memeService.getMemberComments(username).subscribe(comments => {
      this.comments = comments;
    });
  }

  getMemberReplies(username: string) {
    this.memeService.getMemberReplies(username).subscribe(replies => {
      this.replies = replies;
    });
  }

  getMemberNumberOfLikes(username: string) {
    this.memberService.getAllUserLikesNumber(username).subscribe(numberOfLikes => {
      this.numberOfLikes = numberOfLikes;
    })
  }

  getUserPhoto(id: number) {
    this.memberService.getUserPhoto(id).subscribe(photo => {
      this.url = photo?.url;
    })
  }
}