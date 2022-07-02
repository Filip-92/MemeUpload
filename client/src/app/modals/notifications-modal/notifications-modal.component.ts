import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.css']
})
export class NotificationsModalComponent implements OnInit {
  @Input() username: string;
  @Input() modalRef: any;
  scrolltop: number=null;

  constructor(private accountService: AccountService) { }

  notifications: Notification[];

  getNotifications(username: string) {
    this.accountService.getNotifications(username).subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  ngOnInit(): void {
    this.getNotifications(this.username);
  }

  markAsRead(notificationId: number) {
    this.accountService.markAsRead(notificationId);
    this.modalRef.close();
  }

}
