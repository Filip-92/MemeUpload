import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, ValidatorFn, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatuteComponent } from '../modals/statute/statute.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: UntypedFormGroup;
  maxDate: Date;
  validationErrors: string[] = [];
  registrationComplete: boolean = false;
  type: string = "password";
  togglePassword: boolean = false;
  token: string|undefined;

  constructor(public accountService: AccountService, private toastr: ToastrService, 
    private fb: UntypedFormBuilder, private router: Router, private modalServ: NgbModal) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
    this.token = undefined;
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      email: ['', [Validators.required,
                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      username: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: ['', [Validators.required, 
                      Validators.minLength(8), 
                      Validators.maxLength(16),
                      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&_/])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
      statute: [false, Validators.requiredTrue],
      recaptcha: [null, Validators.required]
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value 
        ? null : {isMatching: true}
    }
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/');
      this.registrationComplete = true;
      }, error => {
      this.validationErrors = error;
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  openStatuteModal() {
    const modalRef = this.modalServ.open(StatuteComponent);
    modalRef.componentInstance.modalRef = modalRef;
  }

  showPassword() {
    this.togglePassword = !this.togglePassword;
    if (this.togglePassword) {
      this.type = "text";
    } else {
      this.type = "password"; 
    }
  }

  public send(form: FormControl): void {
    if (form.invalid) {
      for (const control of Object.keys(form.value.token)) {
        form.value[control].markAsTouched();
      }
      return;
    }

    console.debug(`Token [${this.token}] generated`);
  }

}
