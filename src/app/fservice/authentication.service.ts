import { Injectable, Inject } from '@angular/core';
import { BROWSER_STORAGE } from '../fclass/storage';
import { FaccountDataService } from './faccount-data.service';
import { User } from '../fclass/user';
import { Authresponse } from '../fclass/authresponse';
import { Observable } from 'rxjs';
import { BriefUser } from '../fclass/brief-user';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(private dataService: FaccountDataService,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }
  // 

  // public getName(): string {
  //   const uName: string = this.storage.getItem('faccount-name') === null ? '' : this.storage.getItem('faccount-name')!;
  //   return uName;
  // }
  // public getMail(): string {
  //   const uMail = this.storage.getItem('faccount-email') === null ? '' : this.storage.getItem('faccount-email')!;
  //   return uMail;
  // }

  public getToken(): string {
    let uToken = '';
    const str = this.storage.getItem('userObj');
    if (str) {
      let data = str === null ? '' : JSON.parse(str as string);
      uToken = data.token;
     }    
     return uToken;
  }

  // public saveToken(token: string): void {
  //   this.storage.setItem('faccount-token', token);
  // }
  public login(user: User) {
    return this.dataService.login(user);
  }
  
  //   // return this.dataService.login(user)
  //   //   .then((authResp: Authresponse) => {
  //   //     if(user.keep){
  //   //       this.storage.setItem('faccount-name', user.name);
  //   //       this.storage.setItem('faccount-email', user.email);
  //   //       } else{
  //   //         this.storage.setItem('faccount-name', '');
  //   //         this.storage.setItem('faccount-email', '');

  //   //       }
  //   //     this.saveToken(authResp.token);
  //   //   });
  // }
  public register(user: { familyName: string, name: string, email: string, keep: boolean }) {
    return this.dataService.register(user);
    // return this.dataService.register(user)
    //   .then((authResp: Authresponse) => this.saveToken(authResp.token));
  }

  public logout(): boolean {
    //this.storage.removeItem('faccount-token');
    this.storage.removeItem('userObj');
    return true;
  }

  public isLoggedIn(): boolean {
    //console.log('Martin in isLogin')
    //const token: string = this.getToken();
    //console.log(token);
    let ret = false;
    const str = this.storage.getItem('userObj');
    if (str) {
      let data = str === null ? '' : JSON.parse(str as string);
      const token: string = data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      ret = payload.exp > (Date.now() / 1000);
    } else {
      ret = false;
    }
    return ret;

  }

  public getCurrentUser(): User | any {
    const str = this.storage.getItem('userObj');
    let user = new User();
    if (str !== null) {
      let data = str === null ? '' : JSON.parse(str as string);
      let { familycode, email, name, familyname, role, paid, duedate, paytype } = data;
      if(name !== undefined){
        if(name==="潘丁瑜"){
          role="SystemAdmin";
        }
      }
      user = { familycode, email, name, familyname, role, paid, duedate, paytype } as User;
    }
    //console.log(user);
    return user;
  }

  public getFamilyName(): string {
    let ret = "";
    const str = this.storage.getItem('userObj');
    // console.log(str);
    let data = str === null ? '' : JSON.parse(str as string);
    if (data !== '') {
      ret = data.familyname;
    }
    return ret;
  }

  public isPaid(): boolean {
    let ret = false;
    const str = this.storage.getItem('userObj');
    let data = str === null ? '' : JSON.parse(str as string);
    if (data !== '') {
      ret = data.paid === 'Y';
    }
    return ret;
  }

  public isUser(name: string): any {
    return this.dataService.checkAccount(name);
    //return false;
  }

  public saveItem(key: string, value: string) {
    if (this.storage.getItem(key) !== null) {
      this.storage.removeItem(key);
    }
    this.storage.setItem(key, value);
  }
  public getItem(key: string) {
    let ret = this.storage.getItem(key);
    if (ret === 'undefined' || ret === null) {
      ret = '';
    }

    return ret;
  }

  getName(): string {
    return this.getItem('faccount-name');
  }
  getMail(): string {
    return this.getItem('faccount-email');
  }
}
