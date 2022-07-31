import { ConnectionService } from '../_services/connection.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
contactForm: UntypedFormGroup;
disabledSubmitButton: boolean = true;
optionsSelect: Array<any>;
contactFormMode: boolean = true;

  @HostListener('input') oninput() {

  if (this.contactForm.valid) {
    this.disabledSubmitButton = false;
    }
  }

  user: User;

  constructor(private fb: UntypedFormBuilder, private connectionService: ConnectionService,
    public accountService: AccountService, private toastr: ToastrService) {

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);

    if ("user" in localStorage) {
      this.contactForm = fb.group({
        senderName: [this.user.username],
        senderEmail: [this.user.email],
        subject: ['', [Validators.required]],
        message: ['', [Validators.required]],
        contactFormCopy: [''],
        });
    } else {
      this.contactForm = this.fb.group({
        senderName: ['', [Validators.required]],
        senderEmail: ['', [Validators.compose([Validators.required, Validators.email]), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
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
      this.toastr.success('Twoja wiadomość została wysłana');
      this.contactForm.reset();
      this.disabledSubmitButton = true;
      this.contactFormMode = false;
      window.scrollTo(0,0);
    }, error => {
      console.log('Error', error);
    });
  }

  }