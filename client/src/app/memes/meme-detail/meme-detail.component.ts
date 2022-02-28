import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-detail',
  templateUrl: './meme-detail.component.html',
  styleUrls: ['./meme-detail.component.css']
})
export class MemeDetailComponent implements OnInit {

  meme: Meme;
  members: Member;
  users: any;
  id: number = +this.route.snapshot.paramMap.get('id');
  likes: number = 0;

  constructor(private memeService: MemeService, private http: HttpClient,
                private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.route.paramMap.subscribe(() => {
    //   this.handleMemeDetails();
    // })
    this.route.data.subscribe(data => {
      this.meme = data.meme;
    });
    this.getUsers();
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(response => {
      this.users = response;
    }, error => {
      console.log(error);
    })
  }

  // handleMemeDetails() {
    
  //   // get the "id" param string. convert string to a number using the "+" symbol
  //   const theMemeId: number = +this.route.snapshot.paramMap.get('id')!;
    
  //   this.memeService.getMeme(theMemeId).subscribe(
  //     data => {
  //       this.meme = data;
  //     }
  //   )
  // }

}
