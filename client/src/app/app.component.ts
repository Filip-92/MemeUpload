import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';
import { strings as stringsPL } from 'ngx-timeago/language-strings/pl';
import { TimeagoIntl } from 'ngx-timeago';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Memesy';
  users: any;

  constructor(private accountService: AccountService, private presence: PresenceService,
    private http: HttpClient, private intl: TimeagoIntl) {
      intl.strings = stringsPL;
      intl.changes.next();
    }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }

  }
}