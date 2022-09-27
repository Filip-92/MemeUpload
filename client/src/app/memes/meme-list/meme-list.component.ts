import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Division } from 'src/app/_models/division';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { AdminService } from 'src/app/_services/admin.service';
import { MemeService } from 'src/app/_services/meme.service';
import { take } from 'rxjs/operators';
import { AdminDeleteMemeComponent } from 'src/app/modals/admin-delete-meme/admin-delete-meme.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwitchDivisionComponent } from 'src/app/modals/switch-division/switch-division.component';

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
  currentCategory: string;
  podstrona: string;
  user: User;
  morePaginationSettings: boolean = false;
  totalItems: number = 0;
  clicked: boolean = false;
  newPageNumber: number = 0;

  constructor(private memeService: MemeService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
    private adminService: AdminService, private accountService: AccountService, private modalService: NgbModal) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    }

  ngOnInit(): void { 
    this.determineDivision();
  }

  loadMemes() {
    this.memeService.getMemes(this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
      this.totalItems = response.pagination.totalItems;
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
      this.podstrona = 'ostatnie24H';
      this.loadMemesLast24HMain();
    } else if (this.router.url.includes('poczekalnia/ostatnie24H')) {
      this.divisionName = 'Poczekalnia > Ostatnie24H';
      this.podstrona = 'poczekalnia/ostatnie24H';
      this.loadMemesLast24H();
    } else if (this.router.url.includes('kategoria') && this.router.url.includes('ostatnie24H')) {
      var category = this.router.url.split("/");
      this.currentCategory = category[2];
      this.podstrona = this.currentCategory + '/ostatnie24H';
      this.currentCategory = this.currentCategory.replace("-", " ");
      this.divisionName = this.currentCategory + ' > Ostatnie24H';
      this.getDivisionIdByNameLast24H(this.currentCategory)
    } else if (this.router.url.includes('ostatnie48H') && !this.router.url.includes('kategoria') && !this.router.url.includes('poczekalnia')) {
      this.divisionName = 'Ostatnie48H';
      this.podstrona ='ostatnie48H';
      this.loadMemesLast48HMain();
    } else if (this.router.url.includes('poczekalnia/ostatnie48H')) {
      this.divisionName = 'Poczekalnia > Ostatnie48H';
      this.podstrona ='poczekalnia/ostatnie48H';
      this.loadMemesLast48H();
    } else if (this.router.url.includes('kategoria') && this.router.url.includes('ostatnie48H')) {
      var category = this.router.url.split("/");
      this.currentCategory = category[2];
      this.podstrona = this.currentCategory + '/ostatnie48H';
      this.currentCategory = this.currentCategory.replace("-", " ");
      this.divisionName = this.currentCategory + ' > Ostatnie48H';
      this.getDivisionIdByNameLast48H(this.currentCategory)
    } else if (this.router.url.includes('poczekalnia')) {
      this.divisionName = 'Poczekalnia';
      this.podstrona = 'poczekalnia';
      this.loadMemes(); 
    } else if (this.router.url.includes('kategoria')) {
        var category = this.router.url.split("/");
        this.currentCategory = category[2];
        this.podstrona = this.currentCategory;
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

  refresh(): void {
    window.setTimeout(function(){location.reload()},200);
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    if (this.pageNumber === 1) {
      this.pageNumber = 0;
    }
    if (this.newPageNumber === this.pageNumber) {
      window.scrollTo(0,0);
      this.determineDivision();
    }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 0;
    this.determineDivision();
  }

  rejectMeme(memeId: number) {
    this.adminService.rejectMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  removeMeme(memeId) {
    this.memeService.removeMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  disapproveMeme(memeId: number) {
    this.adminService.disapproveMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  hideMeme(memeId: number) {
    this.adminService.hideMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  openDeleteModal(memeId: number) {
    const modalRef = this.modalService.open(AdminDeleteMemeComponent);
    modalRef.componentInstance.memeId = memeId;
    modalRef.componentInstance.modalRef = modalRef;
  }

  openDivisionModal(meme: Meme) {
    const modalRef = this.modalService.open(SwitchDivisionComponent);
    modalRef.componentInstance.meme = meme;
    modalRef.componentInstance.modalRef = modalRef;
  }

  nextPage() {
    if (this.pageNumber == 0) {
      this.pageNumber = 2;
    } else {
      this.pageNumber = this.pageNumber + 1;
    }
    if (this.pageNumber === 1) {
      this.pageNumber = this.pageNumber = 0;
    }
    window.scrollTo(0,0);
    this.determineDivision();
    console.log(this.totalItems / this.pageSize);
  }

  previousPage() {
    if (this.pageNumber === 1 || this.pageNumber === 2) {
      this.pageNumber = 0;
    } else {
      this.pageNumber = this.pageNumber - 1;
    }
    window.scrollTo(0,0);
    this.determineDivision();
  }

  viewMore() {
    this.morePaginationSettings = !this.morePaginationSettings;
  }
}
