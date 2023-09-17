import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  loginForm!: FormGroup;
  resetPasswordEmail!: string;
  isValidEmail!: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private toast: NgToastService,
    private userStoreService: UserStoreService,
    private resetService: ResetPasswordService
  ) {

  }

  ngOnInit(): void {
    const count = signal(0)
    console.log('The count is: ' + count());
    count.update(value => value + 1);
    count.set(3);
    console.log('The count is: ' + count());

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  hideShowPass() {
    this.type === 'text' ? this.type = 'password' : this.type = 'text';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      //send
      console.log("loginForm", this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res) {
            this.loginForm.reset();
            this.authService.storeToken(res.accessToken);
            this.authService.storeRefreshToken(res.refreshToken);
            const tokenPayLoad = this.authService.decodedToken();
            this.userStoreService.setFullNameForStore(tokenPayLoad?.unique_name);
            this.userStoreService.setRoleForStore(tokenPayLoad?.role);
            this.toast.success({ detail: "SUCCESS", summary: `Login Success!`, duration: 5000 });
            this.route.navigate(['dashboard']);
          }
        },
        error: (err) => {
          this.toast.error({ detail: "ERROR", summary: `${err?.error?.message}`, duration: 5000 });
        }
      });
    } else {
      //error
      console.log("loginForm no valid")

      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
  
      this.resetService.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
        next:(res)=>{
          this.toast.success({ detail: "SUCCESS", summary: `Reset Success!`, duration: 3000 });
          console.log(this.resetPasswordEmail);
          this.resetPasswordEmail = '';
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
        },
        error:(err)=>{
          this.toast.error({ detail: "ERROR", summary:'Somethisg went wrong!', duration: 3000 });
        }
      })
    }
  }
}
