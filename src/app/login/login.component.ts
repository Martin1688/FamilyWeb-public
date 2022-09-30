import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../fclass/user';
import { AdminService } from '../fservice/admin.service';
import { AuthenticationService } from '../fservice/authentication.service';
import { HistoryService } from '../fservice/history.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  public credentials = {
    name: '',
    email: '',
    password: '',
    keep: true
  };

  constructor(
    private admin: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private historyService: HistoryService, 
    private recaptchaV3Service: ReCaptchaV3Service) { }

  ngOnInit() {
    let { name, email, password, keep } = this.authenticationService.getCurrentUser();
    this.credentials = { name, email, password, keep } as User;
    this.credentials.keep = true;
    this.credentials.email = this.authenticationService.getMail();
    this.credentials.name = this.authenticationService.getName();
  }
  public onLoginSubmit(): void {
    this.formError = '';
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      this.admin.verifyReCaptcha(token).subscribe((result: { "success": string, 'message': string }) => {
        if (result.success) {
          if (!this.credentials.email || !this.credentials.password) {
            this.formError = '全部欄位都必填';
          } else {
            this.doLogin();
          }
        } else {
          this.formError = result.message;
        }
      });
    });
  }
  private doLogin(): void {
    this.credentials.name = this.captalCase(this.credentials.name);
    const tempUser = new User();
    tempUser.email = this.credentials.email;
    tempUser.password = this.credentials.password;
    tempUser.name = this.credentials.name;
    tempUser.keep = this.credentials.keep;
    //console.log(tempUser);
    this.authenticationService.login(tempUser).subscribe(
      {
        next: (result: { message: string, data: string }) => {
          if (result.message === '') {
            let data = JSON.parse(result.data);
            //console.log(result.data);
            //this.authenticationService.saveToken(data.token);
            this.authenticationService.saveItem('userObj', result.data);
            if(this.credentials.keep){
              this.authenticationService.saveItem('faccount-name', this.credentials.name);
              this.authenticationService.saveItem('faccount-email', this.credentials.email);
              } else{
                this.authenticationService.saveItem('faccount-name', '');
                this.authenticationService.saveItem('faccount-email', '');
      
              }
    
            this.router.navigateByUrl(this.historyService.getLastNonLoginUrl());
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

}

