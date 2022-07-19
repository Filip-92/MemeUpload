import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AboutModalComponent } from '../modals/about-modal/about-modal.component';
import { StatuteComponent } from '../modals/statute/statute.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  bsModalRef: BsModalRef;
  contactFormMode: boolean = false;

  constructor(private modalService: BsModalService, private modalServ: NgbModal) { }

  ngOnInit(): void {
  }

  openModal() {
    const config = {
      class: 'modal-dialog-centered',
    }
    this.bsModalRef = this.modalService.show(AboutModalComponent, config);
  }

  contactFormToggle() {
    this.contactFormMode = !this.contactFormMode;
    this.goToBottom();
  }

  goToBottom(){
    window.scrollTo(0,document.body.scrollHeight);
  }

  openStatuteModal() {
    const modalRef = this.modalServ.open(StatuteComponent);
    modalRef.componentInstance.modalRef = modalRef;
  }

}
