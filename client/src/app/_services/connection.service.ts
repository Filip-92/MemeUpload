import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
providedIn: 'root'
})
export class ConnectionService {
  
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

  sendMessage(model: any) {
    return this.http.post(this.baseUrl + 'users/submit-contact-form', 
    JSON.stringify(model),
    { headers: new HttpHeaders({ 'Content-Type': 'application/json'}), responseType: 'text'});
  }

}