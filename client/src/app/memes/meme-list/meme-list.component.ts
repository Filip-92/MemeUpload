import { Component, OnInit } from '@angular/core';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-list',
  templateUrl: './meme-list.component.html',
  styleUrls: ['./meme-list.component.css']
})
export class MemeListComponent implements OnInit {

  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  memes: Meme[];
  likes: number = 0;

  constructor(private memeService: MemeService) { }

  ngOnInit(): void {
    this.loadMemes();
    // this.getMemes();
  }

  // getMemes() {
  //   this.memeService.getMemes().subscribe(memes => {
  //     this.memes = memes.reverse();
  //   })
  // }

  loadMemes() {
    this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result.reverse();
      this.pagination = response.pagination;
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMemes();
  }

  addLike() {
    this.likes++;
  }

  removeLike() {
    this.likes--;
  }

  replaceTitle(title: string) {
    title.replace(" ", "-");
  }

  convertText(title: string) {
    var result = title?.toLowerCase().split(' ').join('-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return result;
  }

}
