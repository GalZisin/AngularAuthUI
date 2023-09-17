import { Component } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControlOptions, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import ValidateForm from 'src/app/helpers/validateForm';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

// type ValidationErrors = {
//   [key: string]: any;
// };

// interface AbstractControlOptions {
//   validators?: ValidatorFn | ValidatorFn[] | null
//   asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null
//   updateOn?: 'change' | 'blur' | 'submit'
// }

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb: FormBuilder, private activated: ActivatedRoute,
    private toast: NgToastService,
    private router: Router,
    private resetPasswordService: ResetPasswordService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required,],
      confirmPassword: [null, Validators.required,]
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      } as FormControlOptions);

    this.activated.queryParams.subscribe(val => {
      console.log(val);
      this.emailToReset = val['email'];
      let uriToken = (val['code']);
      this.emailToken = uriToken.replace(/ /g, '+');
      console.log("emailToken: " , this.emailToken)
      console.log("emailToReset: " , this.emailToReset)
    });
  }
  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetPasswordService.resetPassword(this.resetPasswordObj)
        .subscribe({
          next: (res) => {
            this.toast.success({
              detail: 'SUCCESS',
              summary: res.message,
              duration: 3000,
            });
            this.router.navigate(['/'])
          },
          error: (err) => {
            this.toast.error({
              detail: 'ERROR',
              summary: "Something went wrong",
              duration: 3000,
            });
          }
        })
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
