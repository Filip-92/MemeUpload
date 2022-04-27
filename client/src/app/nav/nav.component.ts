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
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  open: boolean;
  display: boolean = true;
  isMobile: boolean;
  public innerWidth: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(public accountService: AccountService, private router: Router, 
    private toastr: ToastrService, private messageService: MessageService,
    private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    //this.loadMessages();
    this.open = true;
    this.isMobile = this.deviceService.isMobile();
    this.innerWidth = window.innerWidth;
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
    this.router.navigateByUrl('/');
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    this.loginMode = true;
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    })
  }
}
