import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-top-buttons',
  templateUrl: './top-buttons.component.html',
  styleUrls: ['./top-buttons.component.css']
})
export class TopButtonsComponent implements OnInit {
  link24H: string = "/ostatnie24H";
  link48H: string = "/ostatnie48H";

  constructor(private memeService: MemeService, public router: Router) { }

  id: number;
  meme: Meme = {
    x: '',
    id: 0,
    url: '',
    title: '',
    uploaded: undefined,
    description: '',
    isApproved: false,
    numberOfLikes: 0,
    comments: undefined,
    division: 0
  };

  ngOnInit(): void {
    this.getRandomMeme();
    this.checkForDivision();
  }

  getRandomMeme() {
    this.memeService.getRandomMeme().subscribe(meme => {
      this.meme = meme;
      this.id = this.meme.id;
    })
  }

  checkForDivision() {
    var url = this.router.url.split('/');
    if (url[1] === "" || url[1] === "strona" || url[1] === "ostatnie24H" || url[1] === "ostatnie48H") {
      this.link24H = "/ostatnie24H";
      this.link48H = "/ostatnie48H";
    } else {
      if (url[1] === "kategoria") {
        this.link24H = "/kategoria/" + url[2] + "/ostatnie24H";
        this.link48H = "/kategoria/" + url[2] + "/ostatnie48H";
      } else {
        this.link24H = "/" + url[1] + "/ostatnie24H";
        this.link48H = "/" + url[1] + "/ostatnie48H";
      }
  }
}

}
