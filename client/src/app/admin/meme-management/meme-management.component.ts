import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-meme-management',
  templateUrl: './meme-management.component.html',
  styleUrls: ['./meme-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  memes: Meme[];
  photos: Photo[];
  meme: Meme;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 10;
  trustedUrl: any;

  constructor(private adminService: AdminService) { }
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getMemesForApproval();
    //this.getPhotosForApproval();
  }

  getMemesForApproval() {
  this.adminService.getMemesForApproval(this.pageNumber, this.pageSize).subscribe(response => {
        this.memes = response.result;
        this.pagination = response.pagination;
      });
    }

  approveMeme(memeId) {
    this.adminService.approveMeme(memeId).subscribe(() => {
      this.memes.splice(this.memes.findIndex(p => p.id === memeId), 1);
    })
  }

  rejectMeme(memeId) {
    this.adminService.rejectMeme(memeId).subscribe(() => {
      this.memes.splice(this.memes.findIndex(p => p.id === memeId), 1);
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.getMemesForApproval();
  }

  convertText(title: string) {
    var result = title?.toLowerCase().split(' ').join('-').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return result;
  }

  checkURL(url) {
    return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  formatYoutubeLink(url) {
    var id = url?.split('v=')[1]?.split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

}