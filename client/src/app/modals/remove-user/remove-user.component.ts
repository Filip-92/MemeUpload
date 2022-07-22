import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-remove-user',
  templateUrl: './remove-user.component.html',
  styleUrls: ['./remove-user.component.css']
})
export class RemoveUserComponent implements OnInit {
  @Input() username: string;
  @Input() modalRef: any;
  users: User[];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
  }

  removeUser(username) {
    this.adminService.removeUser(username).subscribe(() => {
      this.users?.splice(this.users?.findIndex(p => p.username === username), 1);
    })
    this.close();
  }

  close() {
    this.modalRef.close();
  }

}
