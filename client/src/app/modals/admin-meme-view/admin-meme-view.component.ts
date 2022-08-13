import { Component, Input, OnInit } from '@angular/core';
import { Meme } from 'src/app/_models/meme';

@Component({
  selector: 'app-admin-meme-view',
  templateUrl: './admin-meme-view.component.html',
  styleUrls: ['./admin-meme-view.component.css']
})
export class AdminMemeViewComponent implements OnInit {
  @Input() meme: Meme;
  @Input() modalRef: any;
  trustedUrl: string;

  constructor() { }

  ngOnInit(): void {
    if (this.meme?.url?.includes("youtube") || this.meme?.url?.includes("youtu.be")) {
      this.trustedUrl = this.meme?.url;
    }
  }

  checkURL(url) {
    return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  close() {
    this.modalRef.close();
  }
}
