import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-list-by-division',
  templateUrl: './meme-list-by-division.component.html',
  styleUrls: ['./meme-list-by-division.component.css']
})
export class MemeListByDivisionComponent implements OnInit {

  pagination: Pagination;
  pageNumber = +this.route.snapshot.paramMap.get('pageNumber');
  pageSize = 8;
  memes: Meme[];
  trustedUrl: any;
  divisionId: number;

  constructor(private memeService: MemeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void { 
    this.loadMemesByDivision(this.divisionId);
    // if (this.router.url !== null) {
    //   this.divisionName = this.router.url.replace("/", "");
    // }

    // else if (this.router.url.includes(this.divisionName)) {
    //   this.loadMemesByDivision(1);
    // }
  }

  loadMemesByDivision(divisionId: number) {
    this.memeService.getMemesByDivision(divisionId, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    window.scrollTo(0,0);
    this.loadMemesByDivision(this.divisionId);
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.loadMemesByDivision(this.divisionId);
  }
}
