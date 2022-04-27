import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
<<<<<<< HEAD
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
=======
import { ActivatedRoute } from '@angular/router';
import { ifError } from 'assert';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';

>>>>>>> 7e6cc682ac912c56942b534094a6411b8b1ddd89
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
<<<<<<< HEAD
    private route: ActivatedRoute, private toastr: ToastrService) { }
=======
                private route: ActivatedRoute, private toastr: ToastrService) { }
>>>>>>> 7e6cc682ac912c56942b534094a6411b8b1ddd89

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

<<<<<<< HEAD
=======
  getMeme(memeId: number) {
    this.memeService.getMeme(memeId).subscribe(memes => {
      this.memes = memes.reverse();
    })
  }

>>>>>>> 7e6cc682ac912c56942b534094a6411b8b1ddd89
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
<<<<<<< HEAD

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

=======
>>>>>>> 7e6cc682ac912c56942b534094a6411b8b1ddd89
}
