import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styleUrls: ['./statute.component.css']
})
export class StatuteComponent implements OnInit {
  @Input() modalRef: any;
  scroller: Subscription;

  constructor() { }

  public tabsContentRef!: ElementRef;

  ngOnInit(): void {
    this.scroller = fromEvent(window, 'scroll')
    .subscribe(() => this.dealWithScroll(window.scrollY));  
  }

  close() {
    this.modalRef.close();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  dealWithScroll(y: number) {}

  checkIfScrolled() {
    if (window.scrollY > 200) {
      return true;
    } else {
      return false;
    }
  }

}
