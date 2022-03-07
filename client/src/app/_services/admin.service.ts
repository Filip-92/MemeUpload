import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Meme } from '../_models/meme';
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

  // getMemesForApproval() {
  //   return this.http.get<Meme[]>(this.baseUrl + 'admin/memes-to-moderate');
  // }

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
          console.log(response.headers.get('Pagination'));
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginatedResult;
      })
    );
  }

  approveMeme(memeId: number) {
    return this.http.post(this.baseUrl + 'admin/approve-meme/' + memeId, {});
  }

  rejectMeme(memeId: number) {
    return this.http.post(this.baseUrl + 'admin/reject-meme/' + memeId, {});
  }
}