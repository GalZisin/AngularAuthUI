import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  type: string = 'password';
  signupForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private route: Router,
    private toast: NgToastService
  ) {

  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  hideShowPass() {
    this.type === 'text' ? this.type = 'password' : this.type = 'text';
  }

  onSubmit() {
    if (this.signupForm.valid) {
      //send
      console.log("signupForm", this.signupForm.value);
      this.authService.signUp(this.signupForm.value).subscribe({
        next: (res) => {
          this.signupForm.reset();
          this.toast.success({ detail: "SUCCESS", summary: `${res?.message}`, duration: 5000 , sticky:true, position:'topCenter'} );
          this.route.navigate(['/login']);
        },
        error: (err) => {
          console.log("signup error", err);

          this.toast.error({ detail: "ERROR", summary: `${err?.error.message}`, duration: 5000 });
        }
      })

    } else {
      //error
      ValidateForm.validateAllFormFields(this.signupForm);
    }
  }
}
