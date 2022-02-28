import { Component, OnInit } from '@angular/core';
import { Meme } from 'src/app/_models/meme';
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

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getMemesForApproval();
    //this.getPhotosForApproval();
  }

  getMemesForApproval() {
    this.adminService.getMemesForApproval().subscribe(memes => {
      this.memes = memes;
    })
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

}