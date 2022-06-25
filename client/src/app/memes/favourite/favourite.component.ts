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
  favouriteMemes: Meme[];

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

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

}
