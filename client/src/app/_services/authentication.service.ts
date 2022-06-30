import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ResetPasswordDto } from "../_interfaces/ResetPasswordDto.model";
import { EnvironmentUrlService } from "./environment-url.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import { ForgotPasswordDto } from "../_interfaces/ForgotPasswordDto.model";
import { environment } from "src/environments/environment";
import { User } from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();
  baseUrl = environment.apiUrl;
  
  constructor(private _http: HttpClient, private _envUrl: EnvironmentUrlService, private _jwtHelper: JwtHelperService,
    private http: HttpClient) { }

  public resetPassword = (route: string, body: ResetPasswordDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  public forgotPassword = (route: string, body: ForgotPasswordDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this._authChangeSub.next(isAuthenticated);
  }

  public isUserAdmin = (): boolean => {
    const token = localStorage.getItem("token");
    const decodedToken = this._jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

    return role === 'Administrator';
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}${route}`;
  }

  public getUserEmailById(userId: number) {
    return this.http.get<User>(this.baseUrl + 'users/get-user-email-by-id/' + userId, {});
  }
}