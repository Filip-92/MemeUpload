import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminDeleteMemeComponent } from 'src/app/modals/admin-delete-meme/admin-delete-meme.component';
import { AdminMemeViewComponent } from 'src/app/modals/admin-meme-view/admin-meme-view.component';
import { SwitchDivisionComponent } from 'src/app/modals/switch-division/switch-division.component';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-meme-management',
  templateUrl: './meme-management.component.html',
  styleUrls: ['./meme-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  memes: Meme[];
  photos: Photo[];
  meme: Meme;
  pagination: Pagination;
  pageNumber = 0;
  pageSize = 10;
  trustedUrl: any;
  memeId: number;
  division: any;

  constructor(private adminService: AdminService, private modalService: NgbModal) { }
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getMemesForApproval();
    //this.getPhotosForApproval();
  }

  getMemesForApproval() {
  this.adminService.getMemesForApproval(this.pageNumber, this.pageSize).subscribe(response => {
        this.memes = response.result;
        this.pagination = response.pagination;
      });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.getMemesForApproval();
  }

  approveMeme(memeId: number) {
    this.adminService.approveMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  pushMemeToMain(memeId: number) {
    this.adminService.pushMemeToMain(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  rejectMeme(memeId: number) {
    this.adminService.rejectMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  openDeleteModal(memeId: number) {
    const modalRef = this.modalService.open(AdminDeleteMemeComponent);
    modalRef.componentInstance.memes = this.memes;
    modalRef.componentInstance.memeId = memeId;
    modalRef.componentInstance.modalRef = modalRef;
  }

  openMemeView(meme: Meme) {
    const modalRef = this.modalService.open(AdminMemeViewComponent);
    modalRef.componentInstance.meme = meme;
    modalRef.componentInstance.modalRef = modalRef;
  }

  getDivisionNameById(divisionId: number) {
  this.adminService.getDivisionNameById(divisionId).subscribe(division => {
    this.division = division;
    });
  }

  openDivisionModal(meme: Meme) {
    const modalRef = this.modalService.open(SwitchDivisionComponent);
    modalRef.componentInstance.meme = meme;
    modalRef.componentInstance.modalRef = modalRef;
  }
}