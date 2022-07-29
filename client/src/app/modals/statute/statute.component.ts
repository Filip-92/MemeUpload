import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styleUrls: ['./statute.component.css']
})
export class StatuteComponent implements OnInit {
  @Input() modalRef: any;
  @ViewChild('scrollMe') meme : ElementRef;
  scrolltop:number=null;

  constructor() { }

  ngOnInit(): void {
    this.scrolltop = 0;
    window.scrollTo(0,0);
  }

  close() {
    this.modalRef.close();
  }

}
