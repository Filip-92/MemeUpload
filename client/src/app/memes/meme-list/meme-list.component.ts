import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Division } from 'src/app/_models/division';
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
  divisionId: number;
  divisions: Division[];
  divisionName: string;
  division: Division;

  constructor(private memeService: MemeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void { 
    if (this.router.url !== null) {
      this.divisionName = this.router.url.replace("/", "");
    }
    if (this.router.url.includes('ostatnie24H')) {
      this.loadMemesLast24H();
    } else if (this.router.url.includes('poczekalnia')) {
      this.loadMemes(); 
    } else if (this.router.url.includes('hard')) {
        this.loadMemesByDivision(1);
    } else {
      this.loadMainMemes();
    }
  }

  loadMemes() {
    this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  loadMainMemes() {
    this.memeService.getMainMemes(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  loadMemesLast24H() {
    this.memeService.getMemesLast24H(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  loadMemesByDivision(divisionId: number) {
    this.memeService.getMemesByDivision(divisionId, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  getDivisions() {
    this.memeService.getDivisions().subscribe(divisions => {
      this.divisions = divisions;
    });
  }

  // getDivisionIdByName(divisionName: string) {
  //   this.memeService.getDivisionIdByName(divisionName).subscribe(division => {
  //     this.division = division;
  //   });
  // }

  getDivisionIdByName(divisionName: string) {
    if (divisionName === 'hard') {
      return 1;
    }
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    window.scrollTo(0,0);
    this.loadMemes();
    if (this.router.url.includes('ostatnie24H')) {  
      this.loadMemesLast24H();
     }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.loadMemes();
  }
}
