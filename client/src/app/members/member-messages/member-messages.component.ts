import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm: NgForm;
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  @Input() messages: Message[];
  @Input() username: string;
  messageContent: string;
  loading = false;
  editToggle : boolean;
  message: any;
  // editForm: FormGroup;

  constructor(public messageService: MessageService, private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
  }

  sendMessage() {
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    }).finally(() => this.loading = false);
  }

  editMessage(id: number) {
    this.editToggle = !this.editToggle;
    //this.initializeEditForm();
  }

  updateMessage() {
    this.messageService.updateMessage(this.message).subscribe(() => {
      this.editForm.reset(this.editForm.value);
      this.editToggle = !this.editToggle;
    })
  }

}