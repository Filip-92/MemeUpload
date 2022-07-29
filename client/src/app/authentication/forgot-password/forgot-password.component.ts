import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordDto } from 'src/app/_interfaces/ForgotPasswordDto.model';
import { AccountService } from 'src/app/_services/account.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: UntypedFormGroup
  public successMessage: string;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;

  constructor(private _authService: AuthenticationService, private accountService: AccountService,
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new UntypedFormGroup({
      email: new UntypedFormControl("", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
    })
  }

  public validateControl = (controlName: string) => {
    return this.forgotPasswordForm.controls[controlName].invalid && this.forgotPasswordForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.controls[controlName].hasError(errorName)
  }

  forgotPassword() {
    this.accountService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(() => {
      this.toastr.success('Link został wysłany, sprawdź swoją skrzynkę mailową aby zmienić hasło.');
      this.forgotPasswordForm.reset();
      this.router.navigateByUrl('/');
    }, error => {
      console.log('Error', error);
    });
  }

}
