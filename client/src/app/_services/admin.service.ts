import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Meme } from '../_models/meme';
import { ContactFormMessages } from '../_models/contactFormMessages';
import { PaginatedResult } from '../_models/pagination';
import { Photo } from '../_models/photo';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  
  paginatedResult: PaginatedResult<Meme[]> = new PaginatedResult<Meme[]>();

  constructor(private http: HttpClient) { }

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }

  getMemesForApproval(page?: number, itemsPerPage?: number) {
  let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    return this.http.get<Meme[]>(this.baseUrl + 'admin/memes-to-moderate', {observe: 'response', params}).pipe(
      map(response => {
        this.paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginatedResult;
      })
    );
  }

  searchForUser(searchString: string) {
    return this.http.get<Photo>(this.baseUrl + 'admin/search-users/' + searchString);
  }

  approveMeme(memeId: number) {
    return this.http.post(this.baseUrl + 'admin/approve-meme/' + memeId, {});
  }

  pushMemeToMain(memeId: number) {
    return this.http.post(this.baseUrl + 'admin/push-meme-to-main/' + memeId, {});
  }

  rejectMeme(memeId: number) {
    return this.http.post(this.baseUrl + 'admin/reject-meme/' + memeId, {});
  }

  removeMessage(messageId: number) {
    return this.http.post(this.baseUrl + 'admin/remove-message/' + messageId, {});
  }

  removeUser(userId: number) {
    return this.http.delete(this.baseUrl + 'admin/remove-user/' + userId, {});
  }

  banUser(username: string, model: any, days: number) {
    return this.http.post(this.baseUrl + 'admin/ban-user/' + username + "/" + days, model);
  }

  unbanUser(username: string) {
    return this.http.post(this.baseUrl + 'admin/unban-user/' + username, {});
  }

  getUserPhoto(id: number) {
    return this.http.get<Photo>(this.baseUrl + 'memes/get-user-photo/' + id);
  }

  getContactFormMessages() {
    return this.http.get<ContactFormMessages[]>(this.baseUrl + 'admin/contact-form-messages', {});
  }

  addDivision(model: any) {
    return this.http.post(this.baseUrl + 'admin/add-division', model);
  }

  removeDivision(divisionId: number) {
    return this.http.post(this.baseUrl + 'admin/remove-division/' + divisionId, {});
  }
}