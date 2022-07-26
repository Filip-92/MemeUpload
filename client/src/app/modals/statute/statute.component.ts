import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statute',
  templateUrl: './statute.component.html',
  styleUrls: ['./statute.component.css']
})
export class StatuteComponent implements OnInit {
  @Input() modalRef: any;

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0,0);
  }

  close() {
    this.modalRef.close();
  }

}
