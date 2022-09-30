import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BriefUser } from '../fclass/brief-user';
import { FamilyItem, FamilyOne } from '../fclass/family-item';
import { BROWSER_STORAGE } from '../fclass/storage';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {
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
  public listFamilies() {
    //console.log(this.getToken());
    const url: string = `${this.apiBaseUrl}/listfamilies`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };

    return this.http.get(url, httpOptions);
  }
  public savePayRec(payRec:any){
    const url: string = `${this.apiBaseUrl}/savePayRec`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };

    return this.http.post(url, payRec,httpOptions);

  } 
  CreatUser(user: BriefUser) {
    console.log(user);
    const url: string = `${this.apiBaseUrl}/fmlyuser`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.post(url, user, httpOptions);
  }
  UpdateUser(user: BriefUser) {
    const url: string = `${this.apiBaseUrl}/fmlyuser`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.put(url, user, httpOptions);
  }
  DelUser(uemail: string) {
    const url: string = `${this.apiBaseUrl}/fmlyuser/${uemail}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.delete(url,  httpOptions);
  }   
  QueryUser(fmli:FamilyOne) {
    const url: string = `${this.apiBaseUrl}/fmlyuser`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.patch(url, fmli, httpOptions);
  }
  ChangePws(obj:any){
    console.log(obj);
    const url: string = `${this.apiBaseUrl}/changePws`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.post(url, obj, httpOptions);

  }
  ForgetPws(obj:any){
    //console.log(obj);
    const url: string = `${this.apiBaseUrl}/forgetpws`;
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': `Bearer ${this.getToken()}`
    //   })
    // };
    return this.http.post(url, obj);

  }
  verifyReCaptcha(token:string){
    const url: string = `${this.apiBaseUrl}/reCaptchaValidate`;
    return this.http.post<any>(url, {recaptcha: token, version:'v3'})
  }

  SuggestCreate(opinion:any) {
    const url: string = `${this.apiBaseUrl}/suggest`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.post(url,opinion, httpOptions);
  }

  SuggestUpdate(opinion:any) {
    const url: string = `${this.apiBaseUrl}/suggest`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.put(url,opinion, httpOptions);
  }

  SuggestQuery(opinion:any) {
    const url: string = `${this.apiBaseUrl}/suggest`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.patch(url,opinion, httpOptions);
  }

  SuggestDelete(id:string) {
    const url: string = `${this.apiBaseUrl}/suggest/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return this.http.delete(url, httpOptions);
  }

  getDateTimeStr(){
    const ret = this.getDateStr()+this.getTimeStr();
    return ret;
  }
  getDateStr(){
    const dt= new Date();
    const dtAry=dt.toLocaleDateString().split('/');
    const ret = dtAry[0]+ 
    (dtAry[1].length === 1 ? '0'+dtAry[1] : dtAry[1]) +
    (dtAry[2].length === 1 ? '0'+dtAry[2] : dtAry[2]);
    return ret;
  }

  getTimeStr(){
    const dt= new Date();
    const tmAry=dt.toTimeString().split(':');
    const ret =tmAry[0] + tmAry[1]+ tmAry[2].split(' ')[0];
    return ret;
  }
}
