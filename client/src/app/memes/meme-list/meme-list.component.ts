import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  pageNumber = +this.route.snapshot.paramMap.get('pageNumber');
  pageSize = 8;
  memes: Meme[];
  trustedUrl: any;

  constructor(private memeService: MemeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMemes();
  }

  loadMemes() {
    this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    window.scrollTo(0,0);
    this.loadMemes();
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.loadMemes();
  }
}
