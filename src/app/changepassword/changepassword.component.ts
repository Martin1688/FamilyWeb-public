import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../fclass/user';
import { AdminService } from '../fservice/admin.service';
import { AuthenticationService } from '../fservice/authentication.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  model = new FormGroup({
    email: new FormControl('null', Validators.required),
    oldPassword: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    newPassword: new FormControl(null, Validators.required)
  });
  public formError: string = '';
  oldPasswordTextType = true;
  passwordTextType = true;
  newPasswordTextType = true;
  user: User | undefined;
  constructor(private admin: AdminService,
    private auth: AuthenticationService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.user = this.auth.getCurrentUser();
    this.model.setValue({ 'email': this.user!.email, 'oldPassword': null, 'password': null, 'newPassword': null });

  }

  ngOnInit(): void {
  }
  onChangePassword() {
    let msg = '';
    // console.log(this.model.value.password === this.model.value.newPassword);
    // console.log(this.model.controls['password'].value === this.model.controls['newPassword'].value);
    // console.log(this.model.value);
    if (!this.model.controls['oldPassword'].value) {
      msg += '舊密碼未填;'
    }
    if (!this.model.controls['password'].value) {
      msg += '新密碼未填;'
    }
    if (!this.model.controls['newPassword'].value) {
      msg += '確認新密碼未填;'
    }
    if (this.model.controls['password'].value !== this.model.controls['newPassword'].value)

      this.formError = '';
    if (msg !== '') {
      this.formError = msg;
    } else {
      this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        this.admin.verifyReCaptcha(token).subscribe((result: { "success": string, 'message': string }) => {
          if (result.success) {
            this.admin.ChangePws(this.model.value).subscribe({
              next: (result: { message: string, data: any } | any) => {
                if (result.message === '') {
                  this.formError = result.data;
                  this.model.setValue({ 'email': this.user!.email, 'oldPassword': null, 'password': null, 'newPassword': null });
                }
                else {
                  this.formError = result.message;
                }

              },
              error: (err: HttpErrorResponse) => {
                const errResult = err.error as { message: string, token: string };
                this.formError = errResult.message;
              }

            });
          } else {
            this.formError = result.message;
          }
        });
      });


    }
  }
  setNewPasswordText() {
    this.newPasswordTextType = !this.newPasswordTextType;
  }

  setPasswordText() {
    this.passwordTextType = !this.passwordTextType;
  }

  setOldPasswordText() {
    this.oldPasswordTextType = !this.oldPasswordTextType;
  }

}
