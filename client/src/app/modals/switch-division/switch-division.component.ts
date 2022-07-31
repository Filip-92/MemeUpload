import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Division } from 'src/app/_models/division';
import { Meme } from 'src/app/_models/meme';
import { AdminService } from 'src/app/_services/admin.service';
import { MemeService } from 'src/app/_services/meme.service';

@Component({
  selector: 'app-switch-division',
  templateUrl: './switch-division.component.html',
  styleUrls: ['./switch-division.component.css']
})
export class SwitchDivisionComponent implements OnInit {
  @Input() meme: Meme;
  @Input() modalRef: any;
  division: Division;
  divisionForm: UntypedFormGroup;
  divisions: Division[];
  validationErrors: string;
  
  constructor(private adminService: AdminService, private fb: UntypedFormBuilder,
    private memeService: MemeService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getDivisionNameById(this.meme.division);
    this.initializeDivisionForm();
    this.getDivisions();
  }

  getDivisionNameById(divisionId: number) {
    this.adminService.getDivisionNameById(divisionId).subscribe(division => {
      this.division = division;
      });
    }

  initializeDivisionForm() {
    this.divisionForm = this.fb.group({
      id: ['0']
    })
  }

  getDivisions() {
    this.memeService.getDivisions().subscribe(divisions => {
      this.divisions = divisions;
    });
  }

  switchDivisions() {
    this.adminService.switchDivisions(this.divisionForm.value, this.meme.id).subscribe(response => {
      this.divisionForm.reset();
      this.modalRef.close();
      this.toastr.success('Pomyślnie zmieniono dział');
      }, error => {
      this.validationErrors = error;
    })
  }

  close() {
    this.modalRef.close();
    this.divisionForm.reset();
  }

}
