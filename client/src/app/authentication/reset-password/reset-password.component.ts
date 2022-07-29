import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDayTemplateData } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import { ToastrService } from 'ngx-toastr';
import { PasswordConfirmationValidatorService } from 'src/app/shared/custom-validators/password-confirmation-validator.service';
import { User } from 'src/app/_models/user';
import { ResetPasswordDto } from '../../_interfaces/ResetPasswordDto.model';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: UntypedFormGroup;
  public changePasswordForm: UntypedFormGroup;
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;

  private _token: string;
  private _email: string;
  private _userId: string;
  private user: any;
  type: string = "password";
  togglePassword: boolean;

  constructor(private _authService: AuthenticationService, private _passConfValidator: PasswordConfirmationValidatorService, 
    private _route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.resetPasswordForm = new UntypedFormGroup({
      password: new UntypedFormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
      confirm: new UntypedFormControl('')
    });
    this._userId = this._route.snapshot.queryParams['userid'];
    this.resetPasswordForm.get('confirm').setValidators([Validators.required,,
      this._passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('password'))]);
    
      this._token = this._route.snapshot.queryParams['token'];
      this._userId = this._route.snapshot.queryParams['userid'];
  }

  public validateControl = (controlName: string) => {
    return this.resetPasswordForm.controls[controlName].invalid && this.resetPasswordForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.resetPasswordForm.controls[controlName].hasError(errorName)
  }

  public resetPassword = (resetPasswordFormValue) => {
    this.showError = this.showSuccess = false;

    const resetPass = { ... resetPasswordFormValue };
    const resetPassDto: ResetPasswordDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this._token,
      userId: this._userId,
    }

    this._authService.resetPassword('account/reset-password', resetPassDto)
    .subscribe(_ => {
      this.showSuccess = true;
    },
    error => {
      this.showError = true;
      this.errorMessage = error;
    })
  }

  public changePassword = (resetPasswordFormValue) => {
    this.showError = this.showSuccess = false;

    const resetPass = { ... resetPasswordFormValue };
    const resetPassDto: ResetPasswordDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this._token,
      userId: this._userId,
    }

    this._authService.resetPassword('account/reset-password', resetPassDto)
    .subscribe(_ => {
      this.showSuccess = true;
    },
    error => {
      this.showError = true;
      this.errorMessage = error;
    })
  }

  getUserEmailById(userId: number) {
    this._authService.getUserEmailById(userId).subscribe(email => {
      this.user = email;
    });
  }

  showPassword() {
    this.togglePassword = !this.togglePassword;
    if (this.togglePassword) {
      this.type = "text";
    } else {
      this.type = "password";
    }
  }

}