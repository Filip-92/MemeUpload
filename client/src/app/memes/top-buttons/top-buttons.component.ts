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
    likes: 0
  };

  ngOnInit(): void {
    this.getRandomMeme();
  }

  getRandomMeme() {
    this.memeService.getRandomMeme().subscribe(meme => {
      this.meme = meme;
      this.id = this.meme.id;
    })
  }

}
