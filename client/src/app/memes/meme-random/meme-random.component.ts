import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-random',
  templateUrl: './meme-random.component.html',
  styleUrls: ['./meme-random.component.css']
})
export class MemeRandomComponent implements OnInit {

  memes: Meme;
  memeArray = [];
  id: number = +this.route.snapshot.paramMap.get('id');
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  meme: Meme;
  randomId: number;

  constructor(private memeService: MemeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getMeme(this.id);
    this.getRandomMeme();
  }

  getMeme(memeId: number) {
    this.memeService.getMeme(memeId).subscribe(memes => {
      this.memes = memes;
    })
  }

  getRandomMeme() {
    this.memeService.getRandomMeme().subscribe(meme => {
      this.meme = meme;
      this.randomId = this.meme.id;
    })
  }

  refresh(): void {
    window.setTimeout(function(){location.reload()},200);
  }

}
