import { Component, Input, OnInit } from '@angular/core';
import { Meme } from 'src/app/_models/meme';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-delete-meme',
  templateUrl: './admin-delete-meme.component.html',
  styleUrls: ['./admin-delete-meme.component.css']
})
export class AdminDeleteMemeComponent implements OnInit {
  @Input() memeId: number;
  @Input() modalRef: any;
  @Input() memes: Meme[];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    console.log(this.memeId);
  }

  rejectMeme(memeId: number) {
    this.adminService.rejectMeme(memeId).subscribe(() => {
      this.memes?.splice(this.memes?.findIndex(p => p.id === memeId), 1);
    })
    this.modalRef.close();
  }

  close() {
    this.modalRef.close();
  }

}
