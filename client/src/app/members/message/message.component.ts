import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
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
    var currentDate = new Date()?.getTime();
    console.log(currentDate);
    console.log(date.getTime());
    console.log((currentDate - date) < 15 * 60 * 1000);
    if ((currentDate - date) > 15 * 60 * 1000) {
      return true;
    } else {
      return false;
    }
  }

}
