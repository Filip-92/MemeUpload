import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-remove-account',
  templateUrl: './remove-account.component.html',
  styleUrls: ['./remove-account.component.css']
})
export class RemoveAccountComponent implements OnInit {
  @Input() user: User;
  @Input() modalRef: any;
  users: User[];

  constructor(private accountService: AccountService, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  removeAccount(username) {
    this.accountService.removeAccount(username).subscribe(() => {
      this.users?.splice(this.users?.findIndex(p => p.username === username), 1);
    })
    this.close();
    this.toastr.success("Konto zostało usunięte pomyślnie")
    this.logout();
  }

  close() {
    this.modalRef.close();
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
