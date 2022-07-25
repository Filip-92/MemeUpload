import { Component, Inject, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminDeleteMemeComponent } from 'src/app/modals/admin-delete-meme/admin-delete-meme.component';
import { AdminMemeViewComponent } from 'src/app/modals/admin-meme-view/admin-meme-view.component';
import { SwitchDivisionComponent } from 'src/app/modals/switch-division/switch-division.component';
import { Division } from 'src/app/_models/division';
import { Meme } from 'src/app/_models/meme';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-meme-for-approval-card',
  templateUrl: './meme-for-approval-card.component.html',
  styleUrls: ['./meme-for-approval-card.component.css']
})
export class MemeForApprovalCardComponent implements OnInit {
  @Input() meme: Meme;
  memes: Meme[];
  division: Division;

  constructor(private adminService: AdminService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getDivisionNameById(this.meme.division);
  }

  approveMeme(memeId: number) {
    this.adminService.approveMeme(memeId).subscribe(() => {
      this.memes.splice(this.memes.findIndex(p => p.id === memeId), 1);
    })
  }

  pushMemeToMain(memeId: number) {
    this.adminService.pushMemeToMain(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
  }

  openDeleteModal(memeId: number) {
    const modalRef = this.modalService.open(AdminDeleteMemeComponent);
    modalRef.componentInstance.memes = this.memes;
    modalRef.componentInstance.memeId = memeId;
    modalRef.componentInstance.modalRef = modalRef;
  }

  rejectMeme(memeId: number) {
    this.adminService.rejectMeme(memeId).subscribe(() => {
      this.memes.splice(this.memes.findIndex(p => p.id === memeId), 1);
    })
  }

  convertText(title: string) {
    var result = title?.toLowerCase().split(' ').join('-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return result;
  }

  checkURL(url) {
    return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  formatYoutubeLink(url) {
    var id = url?.split('v=')[1]?.split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
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
