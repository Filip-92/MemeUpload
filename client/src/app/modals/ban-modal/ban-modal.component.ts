import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-ban-modal',
  templateUrl: './ban-modal.component.html',
  styleUrls: ['./ban-modal.component.css']
})
export class BanModalComponent implements OnInit {
  @Input() username: string;
  @Input() modalRef: any;
  users: Partial<User[]>;
  banUserForm: UntypedFormGroup;
  validationErrors: string[] = [];

  constructor(private adminService: AdminService, private toastr: ToastrService, 
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getUsersWithRoles();
  }

  initializeForm() {
    this.banUserForm = this.fb.group({
      expirationDate: ['', [Validators.required]],
      banReason: ['', [Validators.required]]
    })
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  banUser() {
    var days = this.banUserForm.value.expirationDate;
    this.adminService.banUser(this.username, this.banUserForm.value, days).subscribe(() => {
      this.modalRef.close();
      this.toastr.success('Pomyślnie zbanowano użytkownika ' + this.username + ' na okres ' + days + ' dni');
    }, error => {
      this.validationErrors = error;
    })
  }

  close() {
    this.modalRef.close();
  }

}
