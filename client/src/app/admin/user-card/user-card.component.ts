import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BanModalComponent } from 'src/app/modals/ban-modal/ban-modal.component';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() user: User;
  photo: Photo;
  url: string;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getUserPhoto(this.user.id);
  }

  getUserPhoto(id: number) {
    this.adminService.getUserPhoto(id).subscribe(photo => {
      this.url = photo?.url;
    })
  }

}
