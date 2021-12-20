import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { User } from '../_models/user';
import { CookieService } from 'ngx-cookie-service';
import { of, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';
import { HomeComponent } from '../home/home.component';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient, 
    private presence: PresenceService) { }

    MustMatch(password: any) {

    }
}