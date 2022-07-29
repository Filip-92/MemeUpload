import { Component, Input, OnInit } from '@angular/core';
import { NavComponent } from 'src/app/nav/nav.component';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.css']
})
export class NotificationsModalComponent implements OnInit {
  @Input() username: string;
  @Input() modalRef: any;
  @Input() nav: NavComponent;
  scrolltop: number=null;

  constructor(private accountService: AccountService) { }

  notifications: any;

  getNotifications(username: string) {
    this.accountService.getNotifications(username).subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  ngOnInit(): void {
    this.getNotifications(this.username);
  }

  markAsRead(notificationId: number) {
    this.accountService.markAsRead(notificationId).subscribe(() => {
      this.notifications.splice(this.notifications.findIndex(p => p.id === notificationId), 1);
    });
    this.modalRef.close();
  }

  removeNotification(notificationId: number) {
    this.accountService.removeNotification(notificationId).subscribe(() => {
      this.notifications.splice(this.notifications.findIndex(p => p.id === notificationId), 1);
    })
  }

}
