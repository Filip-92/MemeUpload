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
import { ToastrService } from 'ngx-toastr';

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
  messages: Message[];
  url: string;
  isBanned: boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  constructor(public accountService: AccountService, private router: Router, 
    private messageService: MessageService, private deviceService: DeviceDetectorService, 
    private memeService: MemeService, private modalServ: NgbModal, private toastr: ToastrService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
     };

  ngOnInit(): void {
    if ("user" in localStorage) {
      this.getUnreadMessages(this.user.username);
      this.getUnreadNotifications(this.user.username);
      this.checkIfBanned(this.user.username);
    }
    this.open = true;
    this.isMobile = this.deviceService.isMobile();
    this.innerWidth = window.innerWidth;
    this.getDivisions();
  }


  interval = setInterval(function() {
    if ("user" in localStorage) {
      this.accountService?.isUserBanned(this.user.username).subscribe(response => {
        this.isBanned = response.isBanned;
        console.log(this.isBanned);
        if(this.isBanned) {
          this.logoutOnBan();
        }
      })
  }
  }, 1000);

  
  displayNavbar() {
    this.display = !this.display;
    this.temporarySolution();
  }

  closeNavbar() {
    this.display = !this.display;
    this.temporarySolution();
  }

  login() {
    this.displayNavbar();
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/');
    })
    this.registerMode = false;
  }
  
  refresh() {
    this.getUnreadNotifications(this.user?.username);
    this.getUnreadMessages(this.user?.username);
  }

  temporarySolution() {
    if ("user" in localStorage) {
      this.accountService.isUserBanned(this.user.username).subscribe(response => {
        this.isBanned = response
        if(this.isBanned) {
          this.logoutOnBan();
        }
      })
    }
  }

  checkIfBanned(username: string) {
    this.accountService.isUserBanned(username).subscribe(response => {
      this.isBanned = response
      console.log(this.isBanned)
      if(this.isBanned) {
        this.logoutOnBan();
      }
    })
  }

  logoutOnBan() {
    this.accountService.logout();
    this.toastr.error("Zostałeś zbanowany!")
    this.router.navigateByUrl('/');
  }

  logout() {
    this.displayNavbar();
    this.unreadMessages = 0;
    this.accountService.logout();
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

  getUnreadMessages(username: string) {
    this.messageService.getUnreadMessages(username).subscribe(messages => {
      this.messages = messages;
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
