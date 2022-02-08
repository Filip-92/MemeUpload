import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { User } from '../_models/user';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';
import { HomeComponent } from '../home/home.component';
import { userInfo } from 'os';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  baseUrlChangePassword: string = this.baseUrl + 'profile/change-password';
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient, 
    private presence: PresenceService,
    private cookieService: CookieService) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    )
  }

  loggedIn() {
    if(this.currentUser$ !== null) {
      return true;
    } else {
      return false;
    }
  }

  getUserProfile(): Observable<any> {
    return;
  }

  changePassword(userDetails: any) {
    const resetPasswordViewModel = {
      OldPassword: userDetails.oldPassword,
      Password: userDetails.newPassword,
      ConfirmPassword: userDetails.newPassword,
      Email: userDetails.email
    };

    return this.http  
      .post<any>(this.baseUrlChangePassword, resetPasswordViewModel, {
        headers: { Accept: 'multipart/form-data', 'X-XSRF-TOKEN': this.cookieService.get('XSRF-TOKEN')}
      })
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
         this.setCurrentUser(user);
         this.presence.createHubConnection(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
  
  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
    this.clearCookies();
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  sendForgotPasswordEmail(model:any) {
    return this.http.post(this.baseUrl + 'account/forgotpassword' , model);
  }

  resetPassword(model:any) {
    return this.http.post(this.baseUrl + 'account/resetpassword' , model);
  }

  clearCookies() {
    localStorage.removeItem('twoFactorToken');
    localStorage.removeItem('codeExpiry');
    localStorage.removeItem('isSessionActive');
    localStorage.removeItem('attemptsRemaining');
    localStorage.removeItem('codeSendSuccess');
    localStorage.removeItem('user_id');
  }
}