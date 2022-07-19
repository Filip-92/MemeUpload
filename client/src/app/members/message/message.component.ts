import { take } from 'rxjs/operators';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() message: any;
  @Input() username: string;
  @Input() messages: any;
  messageContent: string;
  loading = false;
  editToggle : boolean;
  @ViewChild('messageForm') messageForm: NgForm;
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  user: User;

  constructor(public messageService: MessageService, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    console.log(this.user.roles);
  }

  editMessage() {
    this.editToggle = !this.editToggle;
  }

  updateMessage() {
    this.messageService.updateMessage(this.message).subscribe(() => {
      this.editForm.reset(this.editForm.value);
      this.editToggle = !this.editToggle;
    })
  }

  removeMessage(id: number) {
    this.messageService.removeMessage(id).subscribe(() => {
      this.messages?.splice(this.messages?.findIndex(p => p.id === id), 1);
    });
  }

  checkIfOlderThan15Mins(date: any) {
    var currentDate = new Date().getTime();
    var newDate = new Date(Number(Date.parse(date))).getTime();
    if (this.user.roles[0] !== 'Admin' || this.user.roles[1] !== 'Moderator') {
      if ((currentDate - newDate) > 15 * 60 * 1000 && this.user.roles !== ['Admin', 'Moderator']) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkIfOlderThan1Hour(date: any) {
    var currentDate = new Date().getTime();
    var newDate = new Date(Number(Date.parse(date))).getTime();
    if (this.user.roles[0] !== 'Admin' || this.user.roles[1] !== 'Moderator') {
      if ((currentDate - newDate) > 60 * 60 * 1000) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
