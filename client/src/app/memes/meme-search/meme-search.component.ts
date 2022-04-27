import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meme } from 'src/app/_models/meme';
import { Pagination } from 'src/app/_models/pagination';
import { MemeService } from 'src/app/_services/meme.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-meme-search',
  templateUrl: './meme-search.component.html',
  styleUrls: ['./meme-search.component.css']
})
export class MemeSearchComponent implements OnInit {

  constructor(private memeService: MemeService, private route: ActivatedRoute, private fb: FormBuilder, private location: Location) { }

  pagination: Pagination;
  pageNumber = +this.route.snapshot.paramMap.get('pageNumber');
  pageSize = 8;
  memes: Meme[];
  memeSearchForm: FormGroup;
  searchString: string;
  searchActive: boolean;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.memeSearchForm= this.fb.group({
      searchString: ['']
    })
  }

  searchForMeme(searchString: string) {
    this.memeService.searchForMeme(searchString, this.pageNumber, this.pageSize).subscribe(response => {
      this.memes = response.result;
      this.pagination = response.pagination;
      this.location.replaceState("memes/szukaj/" + searchString);
      this.searchActive = true;
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.searchForMeme(this.memeSearchForm.value?.searchString);
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.searchForMeme(this.memeSearchForm.value?.searchString);
  }

}
