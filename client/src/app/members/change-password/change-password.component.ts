import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { ValidatorService } from '../../_services/validator.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup;
  oldPassword: FormControl;
  newPassword: FormControl;
  confirmNewPassword: FormControl;

  constructor(private formBuilder: FormBuilder, 
      private accountService: AccountService, 
      private validatorService: ValidatorService, 
      private toastr: ToastrService) {}
  
  ngOnInit(): void {
      this.oldPassword = new FormControl('', [Validators.required]);
      this.newPassword = new FormControl('', [Validators.maxLength(16), Validators.minLength(8)]);
      //this.confirmNewPassword = new FormControl('', Validators.required, this.validatorService.MustMatch(this.newPassword));

      this.updatePasswordForm = this.formBuilder.group({
          'oldPassword': this.oldPassword,
          'newPassword': this.newPassword,
          'confirmNewPassword': this.confirmNewPassword,
      });
  }

  onSubmit() {
      if (this.updatePasswordForm.valid) {
          this.accountService.getUserProfile().subscribe((result) => {
              if (result.email) {
                  let userDetails = this.updatePasswordForm.value;
                  userDetails.email = result.email;
                  this.accountService.changePassword(userDetails).subscribe((result) => {
                      this.toastr.success(result.message);
                  });
              }
          });
      }
  }
}
