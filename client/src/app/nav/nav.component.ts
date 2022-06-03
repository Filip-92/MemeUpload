import { Component, HostListener, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ElementRef } from '@angular/core'; 
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';
import { add } from 'ngx-bootstrap/chronos';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as internal from 'stream';
import { Division } from '../_models/division';
import { MemeService } from '../_services/meme.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}
  collapsed = true;
  private isOpen: boolean = false;
  registerMode = false;
  loginMode = false;
  messages: Message[] = [];
  divisions: Division[];
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  open: boolean;
  display: boolean = true;
  isMobile: boolean;
  public innerWidth: any;
  unreadMessages: number = null;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(public accountService: AccountService, private router: Router, 
    private toastr: ToastrService, private messageService: MessageService,
    private deviceService: DeviceDetectorService, private memeService: MemeService) { }

  ngOnInit(): void {
    this.loadMessages();
    this.open = true;
    this.isMobile = this.deviceService.isMobile();
    this.innerWidth = window.innerWidth;
    this.getDivisions();
  }
  
  displayNavbar() {
    this.display = !this.display;
  }

  closeNavbar() {
    this.display = !this.display;
  }

  login() {
    this.displayNavbar();
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/');
    })
    this.registerMode = false;
  }

  logout() {
    this.displayNavbar();
    this.accountService.logout();
    this.unreadMessages = 0;
    this.router.navigateByUrl('/');
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    this.loginMode = true;
  }

  checkForUnreadMessages(messages: Message[]) {
    for (var message of messages) {
      if (message.dateRead === null) {
        this.unreadMessages++;
      }
    }
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.checkForUnreadMessages(this.messages);
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  getDivisions() {
    this.memeService.getDivisions().subscribe(divisions => {
      this.divisions = divisions;
    });
  }
}
