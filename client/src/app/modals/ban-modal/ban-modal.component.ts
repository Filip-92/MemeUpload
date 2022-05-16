import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  users: Partial<User[]>;
  banUserForm: FormGroup;
  validationErrors: string[] = [];

  constructor(private adminService: AdminService, private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log(this.username);
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
    console.log(this.username);
    var days = this.banUserForm.value.expirationDate;
    this.adminService.banUser(this.username, this.banUserForm.value, days).subscribe(() => {
      this.users.splice(this.users.findIndex(p => p.username === this.username), 1);
      this.toastr.success('Pomyślnie dodano link');
    }, error => {
      this.validationErrors = error;
    })
  }

}
