import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
//import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppModule } from '../app.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppModule,
    RouterModule.forChild([
      { path: 'forgot-password', component: ForgotPasswordComponent },
      //{ path: 'reset-password', component: ResetPasswordComponent }
    ])
  ]
})
export class AuthenticationModule { }