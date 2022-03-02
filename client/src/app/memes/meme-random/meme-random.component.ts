import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
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
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  number;

  constructor(private memeService: MemeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMemes();
    this.number = this.getRandomMeme();
    console.log(this.number);
  }

  getMemes() {
    this.memeService.getMemes().subscribe(memes => {
      this.memes = memes;
    })
  }

  getRandomMeme() {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    for (let meme of this.memes) {
      this.memeArray.push(meme.id);
    }
    console.log(this.memeArray);
    var item = this.memeArray[Math.floor(Math.random()*this.memeArray.length)];
    this.memeArray = [];
    return item;
  }

  refresh(): void {
    window.setTimeout(function(){location.reload()},200);
  }

  // getMemes() {
  //   this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
  //     this.memes = response.result;
  //     this.pagination = response.pagination;
  //   });
  // }

  // getRandomId() {
  //     this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
  //       this.memes = response.result;
  //       for (let meme of this.memes) {
  //         this.memeArray.push(meme.id);
  //       }
  //       var item = this.memeArray[Math.floor(Math.random()*this.memeArray.length)];
  //       this.memeArray = [];
  //       console.log(item);
  //       return item;
  //   });
  // }

}
