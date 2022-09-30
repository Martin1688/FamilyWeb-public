import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BROWSER_STORAGE } from '../fclass/storage';
import { User } from '../fclass/user';
import { Cunsume } from '../fclass/cunsume';
import { Observable } from 'rxjs';
import { BriefUser } from '../fclass/brief-user';
@Injectable({
  providedIn: 'root'
})
export class FaccountDataService {

  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {
    //console.log('martin ' + this.apiBaseUrl);
  }
  editAccount(acnt: Cunsume) {
    const url: string = `${this.apiBaseUrl}/fmaccount/${acnt._id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };

    return this.http
      .put(url, acnt, httpOptions);
  }
  public login(user: User): Observable<any> {
    const url: string = `${this.apiBaseUrl}/login`;
    return this.http.post(url, user);

    // return this.makeAuthApiCall('login', user);
  }
  public register(user: { familyName: string, name: string, email: string, keep: boolean }): Observable<any> {
    const url: string = `${this.apiBaseUrl}/fmregister`;
    return this.http.post(url, user);
  }

  // private makeAuthApiCall(urlPath: string, user: User) {
  //   const url: string = `${this.apiBaseUrl}/${urlPath}`;
  //   return this.http.post(url, user);
  // }
  public checkAccount(uname: string) {
    const url: string = `${this.apiBaseUrl}/isuser`;
    return this.http
      .post(url, { name: uname });
  }


  delItem(_id: string) {
    const url: string = `${this.apiBaseUrl}/fmaccount/${_id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };

    return this.http
      .delete(url, httpOptions);
  }
  private getName(): string {
    const user = this.getCurrentUser();
    let uName = '';
    if (user)
      uName = user.name;
    return uName;
  }
  private getToken(): string {
    let uToken = '';
    const str = this.storage.getItem('userObj');
    if (str) {
      let data = str === null ? '' : JSON.parse(str as string);
      uToken = data.token;
     }    
     return uToken;
  }
  /// add account
  public newAccount(acnt: Cunsume) {
    //console.log(this.getToken());
    const url: string = `${this.apiBaseUrl}/fmaccount`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };

    return this.http.post(url, acnt, httpOptions);
  }
  saveLocalConsume(consume: Cunsume) {
    const uName = this.storage.getItem('LocalConsume');
    var listconsume = JSON.parse(uName!);
    if (listconsume === null || listconsume === undefined) {
      listconsume = [];
    }
    listconsume.push(consume);
    this.storage.setItem('LocalConsume', JSON.stringify(listconsume));
  }
  readLocalConsume(): Cunsume[] {
    const uName = this.storage.getItem('LocalConsume');
    var listconsume = JSON.parse(uName!);
    if (listconsume === null || listconsume === undefined) {
      listconsume = [];
    }
    return listconsume;
  }
  private getCurrentUser(): User | any {
    const str = this.storage.getItem('userObj');
    if (str) {
      let data = str === null ? '' : JSON.parse(str as string);
      let { familycode, email, name, familyname, role, paid, duedate, paytype } = data;
      return { familycode, email, name, familyname, role, paid, duedate, paytype } as User;
    }
  }
}
