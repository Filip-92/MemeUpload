import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Division } from '../_models/division';
import { MemeService } from '../_services/meme.service';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsModalComponent } from '../modals/notifications-modal/notifications-modal.component';
import { Url } from 'url';

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
  pageNumber = 0;
  pageSize = 5;
  loading = false;
  open: boolean;
  display: boolean = true;
  isMobile: boolean;
  public innerWidth: any;
  unreadMessages: number = null;
  user: User;
  notifications: Notification[];
  url: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(public accountService: AccountService, private router: Router, 
    private messageService: MessageService, private deviceService: DeviceDetectorService, 
    private memeService: MemeService, private modalServ: NgbModal) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
     }

    // @ViewChild("component1") meme_list: MemeListComponent;

  ngOnInit(): void {
    if ("user" in localStorage) {
      this.getUserPhoto(this.user.username);
      this.loadMessages();
      this.getUnreadNotifications(this.user.username);
    }
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

  getUserPhoto(username: string) {
    this.memeService.getUserPhoto(username).subscribe(photo => {
      this.url = photo?.url;
    })
  }

  login() {
    this.displayNavbar();
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/');
    })
    this.registerMode = false;
    this.reloadCurrentPage();
  }

  logout() {
    this.displayNavbar();
    this.accountService.logout();
    this.unreadMessages = 0;
    this.router.navigateByUrl('/');
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
    if (this.registerMode) {
      this.goToTop();
      this.closeNavbar();
    }
  }

  goToTop(){
    window.scrollTo(0,0);
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

  openNotificationsModal(username: string) {
    const modalRef = this.modalServ.open(NotificationsModalComponent);
    modalRef.componentInstance.username = username;
    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.nav = NavComponent;
  }

  getUnreadNotifications(username: string) {
    this.accountService.getUnreadNotifications(username).subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  convertText(title: string) {
    var result = title?.toLowerCase().replace(' ', '-');
    return result;
  }

  replaceTitle(title: string) {
    return title.replace(" ", "-");
  }

  reloadCurrentPage() {
    window.setTimeout(function(){location.reload()},100);
   }

}
