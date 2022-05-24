import { ConnectionService } from '../_services/connection.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, HostListener } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent {
contactForm: FormGroup;
disabledSubmitButton: boolean = true;
optionsSelect: Array<any>;
contactFormMode: boolean = true;

  @HostListener('input') oninput() {

  if (this.contactForm.valid) {
    this.disabledSubmitButton = false;
    }
  }

  user: User;

  constructor(private fb: FormBuilder, private connectionService: ConnectionService,
    public accountService: AccountService, private toastr: ToastrService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);

    if (this.user === null) {
      this.contactForm = this.fb.group({
        senderName: ['', [Validators.required]],
        senderEmail: ['', [Validators.compose([Validators.required, Validators.email])]],
        subject: ['', [Validators.required]],
        message: ['', [Validators.required]],
        contactFormCopy: [''],
        });
    } else {
      this.contactForm = fb.group({
        senderName: [this.user.username],
        senderEmail: [this.user.email],
        subject: ['', [Validators.required]],
        message: ['', [Validators.required]],
        contactFormCopy: [''],
        });
    }
  }

  contactFormToggle() {
    this.contactFormMode = !this.contactFormMode;
  }

  onSubmit() {
    this.connectionService.sendMessage(this.contactForm.value).subscribe(() => {
      this.toastr.success('Your message has been sent.');
      this.contactForm.reset();
      this.disabledSubmitButton = true;
    }, error => {
      console.log('Error', error);
    });
  }

  }