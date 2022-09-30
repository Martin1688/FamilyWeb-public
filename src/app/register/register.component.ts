import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../fservice/authentication.service';
import { HistoryService } from '../fservice/history.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AdminService } from '../fservice/admin.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public formError: string = '';
  passwordTextType = false;
  password2TextType = true;
  private accountUsed = false;
  public credentials = {
    familyName: '',
    name: '',
    email: '',
    // password: '',
    // password2: '',
    keep: true
  };
  // public pageContent = {
  //   header: {
  //     title: 'Create a new account',
  //     strapline: ''
  //   },
  //   sidebar: ''
  // };
  constructor(private admin: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService, 
    private recaptchaV3Service: ReCaptchaV3Service
  ) { }

  ngOnInit() {
  }
  public onRegisterSubmit(): void {
    // console.log(this.credentials);
    this.formError = '';
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      this.admin.verifyReCaptcha(token).subscribe((result: { "success": string, 'message': string }) => {
        if (result.success) {
          if (
            !this.credentials.name ||
            !this.credentials.email 
            //||!this.credentials.password
          ) {
            this.formError = '全部欄位都是必填，請再試一次';
          } else {
            this.doRegister();
          }      
        } else {
          this.formError = result.message;
        }
      });
    });
  }
  private doRegister(): void {
    this.authenticationService.register(this.credentials).subscribe(
      {
        next: (result: { message: string, data: string }) => {
          if (result.data === 'ok') {
            this.formError = result.message;
            setTimeout(() => {
              this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());              
            }, 20000);
          }
          else {
            this.formError = result.message;
          }

        },
        error: (err: HttpErrorResponse) => {
          const errResult = err.error as { message: string, token: string };
          this.formError = errResult.message;
          //console.log(err.error);
        }
      }
    );
  }

  checkAccount(): any {
    this.credentials.name = this.captalCase(this.credentials.name);
    this.authenticationService.isUser(this.credentials.name);//未實作isUser
  }

  clearErr(): void {
    this.formError = '';
    this.credentials.name = '';
  }
  public captalCase(input: string): string {
    if (!input) {
      return '';
    } else {
      return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
    }
  }

  setPasswordText() {
    this.passwordTextType = !this.passwordTextType;
    var elements = document.getElementsByClassName('fpws');
    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        const ele = elements[i] as Element;
        if (this.passwordTextType) {
          ele.setAttribute('type', 'Text');
        } else {
          ele.setAttribute('type', 'Password');
        }
      }
    }

  }
  setPassword2Text() {
    this.password2TextType = !this.password2TextType;
  }

}
