import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-random',
  templateUrl: './meme-random.component.html',
  styleUrls: ['./meme-random.component.css']
})
export class MemeRandomComponent implements OnInit {

  memes: Meme[];
  memeArray = [];
  id: number = +this.route.snapshot.paramMap.get('id');

  constructor(private memeService: MemeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMemes();
  }

  getMemes() {
    this.memeService.getMemes().subscribe(memes => {
      this.memes = memes;
    })
  }

}
