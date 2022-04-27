import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Meme } from '../_models/meme';
import { MemeService } from '../_services/meme.service';

@Injectable({
  providedIn: 'root'
})
export class MemeDetailedResolver implements Resolve<Meme> {
  
  constructor(private memeService: MemeService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Meme> {
        return this.memeService.getMeme(route.paramMap.get("meme"));
    }
}

