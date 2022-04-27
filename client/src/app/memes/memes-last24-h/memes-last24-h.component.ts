import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-memes-last24-h',
  templateUrl: './memes-last24-h.component.html',
  styleUrls: ['./memes-last24-h.component.css']
})
export class MemesLast24HComponent implements OnInit {

  pagination: Pagination;
  pageNumber = +this.route.snapshot.paramMap.get('pageNumber');
  pageSize = 8;
  memes: Meme[];

  constructor(private memeService: MemeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMemesLast24H();
  }

  loadMemesLast24H() {
    this.memeService.getMemesLast24H(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMemesLast24H();
  }

}
