import { Component, Input, OnInit } from '@angular/core';
import { Meme } from 'src/app/_models/meme';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-card-favourite',
  templateUrl: './meme-card-favourite.component.html',
  styleUrls: ['./meme-card-favourite.component.css']
})
export class MemeCardFavouriteComponent implements OnInit {
  @Input() meme: any;
  trustedUrl: any;
  memes: Meme[];
  favouriteMemes: Meme[];
  favourite: boolean;

  constructor(private memeService: MemeService) { }

  ngOnInit(): void {
    this.getMeme(this.meme?.memeId);
  }

  getMeme(memeId: number) {
    this.memeService.getMeme(memeId).subscribe(meme => {
      this.meme = meme;
    })
  }

  getFavouriteMemes(username: string) {
    this.memeService.getFavouritesList(username).subscribe(response => {
      this.memes = response;
      if (this.favouriteMemes?.length > 0) {
        for (var meme of this.favouriteMemes) {
          this.checkIfMemeFavourite(meme?.memeId);
        }
      }
    });
  }

  checkIfMemeFavourite(id: number) {
    if (id === this.meme.id) {
      this.favourite = !this.favourite;
    }
  }

}
