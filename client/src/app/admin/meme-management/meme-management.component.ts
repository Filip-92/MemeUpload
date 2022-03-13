import { Component, OnInit } from '@angular/core';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-meme-management',
  templateUrl: './meme-management.component.html',
  styleUrls: ['./meme-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  memes: Meme[];
  photos: Photo[];
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getMemesForApproval();
    //this.getPhotosForApproval();
  }

  // getMemesForApproval() {
  //   this.adminService.getMemesForApproval().subscribe(memes => {
  //     this.memes = memes;
  //   })
  // }

  getMemesForApproval() {
  this.adminService.getMemesForApproval(this.pageNumber, this.pageSize).subscribe(response => {
        this.memes = response.result.reverse();
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
      window.location.replace('/admin');
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.getMemesForApproval();
  }

}