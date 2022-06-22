import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Meme } from 'src/app/_models/meme';
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

  constructor(private accountService: AccountService, private memeService: MemeService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.getFavouriteMemes(this.user.username);
  }

  getFavouriteMemes(username: string) {
    this.memeService.getFavourites(username).subscribe(response => {
      this.memes = response;
    });
  }

  getMeme(memeId: number) {
    this.memeService.getMeme(memeId).subscribe(meme => {
      this.meme = meme;
      if (this.meme.url.includes("youtube")) {
        this.trustedUrl = this.formatYoutubeLink(this.meme.url)
      }
    })
  }

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

}
