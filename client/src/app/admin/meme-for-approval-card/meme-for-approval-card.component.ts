import { Component, Inject, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminDeleteMemeComponent } from 'src/app/modals/admin-delete-meme/admin-delete-meme.component';
import { AdminMemeViewComponent } from 'src/app/modals/admin-meme-view/admin-meme-view.component';
import { SwitchDivisionComponent } from 'src/app/modals/switch-division/switch-division.component';
import { Division } from 'src/app/_models/division';
import { Meme } from 'src/app/_models/meme';
import { AdminService } from 'src/app/_services/admin.service';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-for-approval-card',
  templateUrl: './meme-for-approval-card.component.html',
  styleUrls: ['./meme-for-approval-card.component.css']
})
export class MemeForApprovalCardComponent implements OnInit {
  @Input() meme: Meme;
  memes: Meme[];
  division: Division;

  constructor(private memeService: MemeService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getDivisionNameById(this.meme?.division)
  }

  convertText(title: string) {
    var result = title?.toLowerCase().split(' ').join('-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return result;
  }

  checkURL(url) {
    return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  getDivisionNameById(divisionId: number) {
    this.memeService.getDivisionNameById(divisionId).subscribe(division => {
      this.division = division;
    })
  }

  openDivisionModal(meme: Meme) {
    const modalRef = this.modalService.open(SwitchDivisionComponent);
    modalRef.componentInstance.meme = meme;
    modalRef.componentInstance.modalRef = modalRef;
  }
}
