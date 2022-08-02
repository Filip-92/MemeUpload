import { Component, OnInit } from "@angular/core";
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { User } from "src/app/_models/user";
import { AccountService } from "src/app/_services/account.service";
import { MembersService } from "src/app/_services/members.service";
import { ValidatorService } from "src/app/_services/validator.service";
import { take } from 'rxjs/operators';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RemoveAccountComponent } from "src/app/modals/remove-account/remove-account.component";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  updatePasswordForm: UntypedFormGroup;
  user: User;
  typeOld: string = "password";
  typeNew: string = "password";
  toggleOld: boolean;
  toggleNew: boolean;

  constructor(private formBuilder: UntypedFormBuilder, private accountService: AccountService, 
      private validatorService: ValidatorService, private toastr: ToastrService, private modalServ: NgbModal) {
        this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
      }
  
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.updatePasswordForm = this.formBuilder.group({
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(8), 
                        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&_/])[A-Za-z\d$@$!%*?&].{8,}')]],
        confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.accountService.changePassword(this.user.email, this.updatePasswordForm.value).subscribe(() => {
      this.toastr.success('Hasło zostało zmienione');
      this.updatePasswordForm.reset();
    }, error => {
      console.log('Error', error);
    });
  }

  passwordsMatch() {
    if (this.updatePasswordForm.value.newPassword === this.updatePasswordForm.value.confirmNewPassword) {
      return true;
    } else {
      return false;
    }
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo]?.value 
        ? null : {isMatching: true}
    }
  }

  openRemoveAccountModal(user: any) {
    const modalRef = this.modalServ.open(RemoveAccountComponent);
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.modalRef = modalRef;
  }

  showOldPassword() {
    this.toggleOld = !this.toggleOld;
    if (this.toggleOld) {
      this.typeOld = "text";
    } else {
      this.typeOld = "password";
    }
  }

  showNewPassword() {
    this.toggleNew = !this.toggleNew;
    if (this.toggleNew) {
      this.typeNew = "text";
    } else {
      this.typeNew = "password";
    }
  }
}