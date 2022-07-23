import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  pageNumber = 1;
  // pageNumber = +this?.route?.snapshot?.paramMap?.get('pageNumber');
  pageSize = 8;
  memes: Meme[];
  trustedUrl: any;
  divisionId: number;
  divisions: Division[];
  divisionName: string;
  division: Division;
  currentCategory: string;
  podstrona: string;

  constructor(private memeService: MemeService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void { 
    if (this.pageNumber > 1) {
      this.pageNumber = +this?.route?.snapshot?.paramMap?.get('pageNumber');
    }
    this.determineDivision();
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

  loadMemesLast24HMain() {
    this.memeService.getMemesLast24HMain(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  loadMemesLast24HDivision(divisionId: number) {
    this.memeService.getMemesLast24HDivision(divisionId, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  loadMemesLast48H() {
    this.memeService.getMemesLast48H(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  loadMemesLast48HMain() {
    this.memeService.getMemesLast48HMain(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
    });
  }

  loadMemesLast48HDivision(divisionId: number) {
    this.memeService.getMemesLast48HDivision(divisionId, this.pageNumber, this.pageSize).subscribe(response => {
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

  determineDivision() {
    if (this.router.url.includes('ostatnie24H') && !this.router.url.includes('kategoria') && !this.router.url.includes('poczekalnia')) {
      this.divisionName = 'Ostatnie24H';
      this.loadMemesLast24HMain();
    } else if (this.router.url.includes('poczekalnia/ostatnie24H')) {
      this.divisionName = 'Poczekalnia > Ostatnie24H';
      this.loadMemesLast24H();
    } else if (this.router.url.includes('kategoria') && this.router.url.includes('ostatnie24H')) {
      var category = this.router.url.split("/");
      this.currentCategory = category[2];
      this.currentCategory = this.currentCategory.replace("-", " ");
      this.divisionName = this.currentCategory + ' > Ostatnie24H';
      this.getDivisionIdByNameLast24H(this.currentCategory)
    } else if (this.router.url.includes('ostatnie48H') && !this.router.url.includes('kategoria') && !this.router.url.includes('poczekalnia')) {
      this.divisionName = 'Ostatnie48H';
      this.loadMemesLast48HMain();
    } else if (this.router.url.includes('poczekalnia/ostatnie48H')) {
      this.divisionName = 'Poczekalnia > Ostatnie48H';
      this.loadMemesLast48H();
    } else if (this.router.url.includes('kategoria') && this.router.url.includes('ostatnie48H')) {
      var category = this.router.url.split("/");
      this.currentCategory = category[2];
      this.currentCategory = this.currentCategory.replace("-", " ");
      this.divisionName = this.currentCategory + ' > Ostatnie48H';
      this.getDivisionIdByNameLast48H(this.currentCategory)
    } else if (this.router.url.includes('poczekalnia')) {
      this.divisionName = 'Poczekalnia';
      this.loadMemes(); 
    } else if (this.router.url.includes('kategoria')) {
        var category = this.router.url.split("/");
        this.currentCategory = category[2];
        this.currentCategory = this.currentCategory.replace("-", " ");
        this.getDivisionIdByName(this.currentCategory);
        this.divisionName = this.currentCategory;
    } else {
      this.loadMainMemes();
      this.divisionName = 'Główna';
    }
  }


  getDivisions() {
    this.memeService.getDivisions().subscribe(divisions => {
      this.divisions = divisions;
    });
  }

  getDivisionIdByName(divisionName: string) {
    this.memeService.getDivisionIdByName(divisionName).subscribe(division => {
      this.division = division;
      if(this.division.isCloseDivision) {
        if ("user" in localStorage) {
          this.loadMemesByDivision(this.division.id);
        } else {
          this.toastr.warning("Zaloguj się aby mieć dostęp do działu zamkniętego");
          this.router.navigateByUrl('/');
        }
      } else {
        this.loadMemesByDivision(this.division.id);
      }
    });
  }

  getDivisionIdByNameLast24H(divisionName: string) {
    this.memeService.getDivisionIdByName(divisionName).subscribe(division => {
      this.division = division;
      if(this.division.isCloseDivision) {
        if ("user" in localStorage) {
          this.loadMemesLast24HDivision(this.division.id);
        } else {
          this.toastr.warning("Zaloguj się aby mieć dostęp do działu zamkniętego");
          this.router.navigateByUrl('/');
        }
      } else {
        this.loadMemesLast24HDivision(this.division.id);
      }
    });
  }

  getDivisionIdByNameLast48H(divisionName: string) {
    this.memeService.getDivisionIdByName(divisionName).subscribe(division => {
      this.division = division;
      if(this.division.isCloseDivision) {
        if ("user" in localStorage) {
          this.loadMemesLast48HDivision(this.division.id);
        } else {
          this.toastr.warning("Zaloguj się aby mieć dostęp do działu zamkniętego");
          this.router.navigateByUrl('/');
        }
      } else {
        this.loadMemesLast48HDivision(this.division.id);
      }
    });
  }

  

  pageChanged(event: any) {
    this.pageNumber = event.page;
    window.scrollTo(0,0);
    this.loadMemes();
    if (this.router.url.includes('ostatnie24H')) {  
      this.podstrona = 'ostatnie24H';
      this.loadMemesLast24H();
     } else if (this.router.url.includes('ostatnie48H')) {  
      this.loadMemesLast48H();
     } else if (this.router.url.includes('poczekalnia')) {
      this.podstrona = 'poczekalnia';
      this.loadMemes();
     } else {
      this.loadMainMemes();
     }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.loadMemes();
  }
}
