import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { HelperService } from 'src/app/_services/helper.service';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-meme-detail',
  templateUrl: './meme-detail.component.html',
  styleUrls: ['./meme-detail.component.css']
})
export class MemeDetailComponent implements OnInit {
  meme: Meme;
  memes: Meme[];
  comments: Comment[];
  members: Member;
  users: any;
  id: number = +this.route.snapshot.paramMap.get('id');
  likes: number = 0;

  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  trustedUrl: any;
  commentForm: FormGroup;
  validationErrors: string[] = [];

  constructor(private memeService: MemeService, private http: HttpClient,
    private route: ActivatedRoute, private toastr: ToastrService,
    private helper: HelperService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.meme = data.meme;
    });
    this.initializeForm();
    this.getMeme(this.id);
    this.getComments(this.id);
  }

  getMeme(memeId: number) {
    this.memeService.getMeme(memeId).subscribe(meme => {
      this.meme = meme;
      if (this.meme.url.includes("youtube")) {
        this.trustedUrl = this.formatYoutubeLink(this.meme.url)
      }
    })
  }
  
  changeTimeZone(uploadedDate: string) {
    uploadedDate = this.helper?.changeTimeZone(uploadedDate)!;
    return uploadedDate;
  }

  addLike() {
    this.likes++;
  }

  removeLike() {
    this.likes--;
  }

  checkURL(url: string) {
    return(url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  onErrorFunction() {
    this.toastr.error("Adres url jest zjebany!")
  }

  formatYoutubeLink(url) {
    var id = url.split('v=')[1].split('&')[0]; //sGbxmsDFVnE
    url = "https://www.youtube-nocookie.com/embed/" + id;
    return url;
  }

  initializeForm() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(2000)]],
      memeId: [this.id]
    })
  }

  addComment() {
    this.memeService.addComment(this.commentForm.value).subscribe(response => {
      this.toastr.success('Pomyślnie dodano komentarz');
      this.commentForm.reset();
      }, error => {
      this.validationErrors = error;
    })
  }

  getComments(memeId: number) {
    this.memeService.getComments(memeId).subscribe(comments => {
      this.comments = comments;
    });
  }

}
