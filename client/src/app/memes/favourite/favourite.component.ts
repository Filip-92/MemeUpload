import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent implements OnInit {
  user: User;
  memes: Meme[];
  meme: Meme;
  trustedUrl: any;
  favouriteMemes: Meme[];
  pagination: Pagination;
  pageNumber = +this.route.snapshot.paramMap.get('pageNumber');
  pageSize = 8;

  constructor(private accountService: AccountService, private memeService: MemeService, private route: ActivatedRoute) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.getFavouriteMemes(this.user.username);
  }

  getFavouriteMemes(username: string) {
    this.memeService.getFavourites(username, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    window.scrollTo(0,0);
    this.getFavouriteMemes(this.user.username);
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.getFavouriteMemes(this.user.username);
  }

}
