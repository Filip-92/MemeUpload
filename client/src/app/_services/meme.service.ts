import { Injectable, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../_models/member';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Meme } from '../_models/meme';
import { PresenceService } from './presence.service';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { Photo } from '../_models/photo';
import { Division } from '../_models/division';
import { Reply } from '../_models/reply';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  @Input() member: Member;
  // @Input() meme: Meme;
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memes: Meme[] = [];
  memberCache = new Map();
  memeCache = new Map();
  user: User;
  userParams: UserParams;
  meme: Meme = {
    x: '',
    id: 0,
    url: '',
    title: '',
    uploaded: undefined,
    description: '',
    isApproved: false,
    numberOfLikes: 0,
    comments: undefined
  };

  paginatedResult: PaginatedResult<Meme[]> = new PaginatedResult<Meme[]>();
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private http: HttpClient, private accountService: AccountService,
                private presence: PresenceService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getMemes(page?: number, itemsPerPage?: number) {
  let params = new HttpParams();

  if (page !== null && itemsPerPage !== null) {
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', itemsPerPage.toString());
  }
  return this.http.get<Meme[]>(this.baseUrl + 'memes/memes-to-display', {observe: 'response', params}).pipe(
    map(response => {
      this.paginatedResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return this.paginatedResult;
    })
  );
}

getMainMemes(page?: number, itemsPerPage?: number) {
  let params = new HttpParams();

  if (page !== null && itemsPerPage !== null) {
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', itemsPerPage.toString());
  }
  return this.http.get<Meme[]>(this.baseUrl + 'memes/memes-to-display-main', {observe: 'response', params}).pipe(
    map(response => {
      this.paginatedResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return this.paginatedResult;
    })
  );
}

  getMemesLast24H(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    return this.http.get<Meme[]>(this.baseUrl + 'memes/memes-to-moderate/last24H', {observe: 'response', params}).pipe(
      map(response => {
        this.paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginatedResult;
      })
    );
  }

  getMeme(id: number) {
    return this.http.get<Meme>(this.baseUrl + 'memes/display-meme-detail/' + id);
  }

  getRandomMeme() {
    return this.http.get<Meme>(this.baseUrl + 'memes/get-random-meme/');
  }

  searchForMeme(searchString: string, type: any, page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

  if (page !== null && itemsPerPage !== null) {
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', itemsPerPage.toString());
  }
  return this.http.get<Meme[]>(this.baseUrl + 'memes/search-memes/' + searchString + "/" + type, {observe: 'response', params}).pipe(
    map(response => {
      this.paginatedResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return this.paginatedResult;
    })
  );
  }

  getMemberMemes(username: string, page?: number, itemsPerPage?: number) {
  let params = new HttpParams();

  if (page !== null && itemsPerPage !== null) {
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', itemsPerPage.toString());
  }
  return this.http.get<Meme[]>(this.baseUrl + 'memes/get-member-memes/' + username, {observe: 'response', params}).pipe(
    map(response => {
      this.paginatedResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return this.paginatedResult;
    })
    );
  }

  getAllMemes() {
    return this.http.get<Meme[]>(this.baseUrl + 'admin/memes-to-moderate');
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'memes/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'memes/delete-photo/' + photoId);
  }
  
  addLike(memeId: number) {
    return this.http.post(this.baseUrl + 'memes/add-meme-like/' + memeId, {});
  }

  addDislike(memeId: number) {
    return this.http.post(this.baseUrl + 'memes/add-meme-dislike/' + memeId, {});
  }

  getLikes() {
    return this.http.get<Partial<Meme[]>>(this.baseUrl + 'memes/likes', {});
  }

  addFavourite(memeId: number) {
    return this.http.post(this.baseUrl + 'memes/add-meme-to-favourite/' + memeId, {});
  }

  getFavourites(username: string) {
    return this.http.get<Partial<Meme[]>>(this.baseUrl + 'memes/get-user-favourites/' + username, {});
  }

  addCommentLike(commentId: number) {
    return this.http.post(this.baseUrl + 'memes/add-comment-like/' + commentId, {});
  }

  addCommentDislike(commentId: number) {
    return this.http.post(this.baseUrl + 'memes/add-comment-dislike/' + commentId, {});
  }

  getCommentLikes() {
    return this.http.get<Partial<Comment[]>>(this.baseUrl + 'memes/comment-likes', {});
  }

  removeMeme(memeId: number) {
    return this.http.post(this.baseUrl + 'memes/remove-meme/' + memeId, {});
  }

  addYoutubeLink(model: any) {
    return this.http.post(this.baseUrl + 'memes/add-youtube-link', model);
  }

  addComment(model: any) {
    return this.http.post(this.baseUrl + 'memes/add-comment', model);
  }

  getComments(memeId: number) {   
      return this.http.get<Comment[]>(this.baseUrl + 'memes/get-comments/' + memeId);
  }

  getMemberComments(username: string) {
      return this.http.get<Comment[]>(this.baseUrl + 'memes/get-member-comments/' + username);
  }

  removeComment(commentId: number) {
    return this.http.post(this.baseUrl + 'memes/remove-comment/' + commentId, {});
  }

  addReply(model: any) {
    return this.http.post(this.baseUrl + 'memes/add-reply', model);
  }

  getReplies(commentId: number) {   
    return this.http.get<Reply[]>(this.baseUrl + 'memes/get-replies/' + commentId);
  }

  removeReply(replyId: number) {
    return this.http.post(this.baseUrl + 'memes/remove-reply/' + replyId, {});
  }

  getUserPhoto(username: string) {
    return this.http.get<Photo>(this.baseUrl + 'memes/get-user-photo-by-username/' + username);
  }

  getDivisions() {   
    return this.http.get<Division[]>(this.baseUrl + 'memes/get-divisions');
  }

  getMemesByDivision(divisionId: number, page?: number, itemsPerPage?: number) {
    let params = new HttpParams();
  
    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    return this.http.get<Meme[]>(this.baseUrl + 'memes/get-memes-by-division/' + divisionId, {observe: 'response', params}).pipe(
      map(response => {
        this.paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginatedResult;
      })
    );
  }

  getDivisionNameById(divisionId: number) {
    return this.http.get<Division>(this.baseUrl + 'memes/get-division-name-by-id/' + divisionId);
  }

  getDivisionIdByName(divisionName: string) {
    return this.http.get<Division>(this.baseUrl + 'memes/get-division-id-by-name/' + divisionName);
  }

  getNumberOfComments(memeId: number) {
    return this.http.get<number>(this.baseUrl + 'memes/get-number-of-comments/' + memeId, {});
  }
}