import { Component, Input, OnInit } from '@angular/core';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-card-favourite',
  templateUrl: './meme-card-favourite.component.html',
  styleUrls: ['./meme-card-favourite.component.css']
})
export class MemeCardFavouriteComponent implements OnInit {
  @Input() meme: any;
  trustedUrl: any;

  constructor(private memeService: MemeService) { }

  ngOnInit(): void {
    this.getMeme(this.meme.memeId);
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
