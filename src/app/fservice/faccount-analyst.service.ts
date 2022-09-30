import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BROWSER_STORAGE } from '../fclass/storage';
import { Para } from '../fclass/para';

@Injectable({
  providedIn: 'root'
})
export class FaccountAnalystService {


  private apiBaseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {
  }

  public readMonthItems(paras: any) {
    const url: string = `${this.apiBaseUrl}/fmaccount`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };

    return this.http.patch(url, paras,httpOptions);
  }

  public getParasByName(model:Para){
    const url: string = `${this.apiBaseUrl}/paras`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http.patch(url, model,httpOptions); 
  }
  
  public setParasByName(model:Para){
    const url: string = `${this.apiBaseUrl}/paras`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http.post(url, model,httpOptions); 
  }
  public   queryFamilyMembers(familycode: string) {//
    const url: string = `${this.apiBaseUrl}/listFmUsers`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http.post(url, {familycode:familycode}, httpOptions); 
  }

  public setIncome(model:any){
    const url: string = `${this.apiBaseUrl}/income`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http.post(url, model, httpOptions); 
  }
  public queryIncomes(familycode: string,yearmonth: string) {
    const url: string = `${this.apiBaseUrl}/income`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http.patch(url, {familycode:familycode, yearmonth: yearmonth}, httpOptions); 
  }

  delIncome(_id: any) {
    const url: string = `${this.apiBaseUrl}/income/${_id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http.delete(url,  httpOptions); 
  }

  public delById(_id:string){
    const url: string = `${this.apiBaseUrl}/paras/${_id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('faccount-token')}`
      })
    };
    return this.http.delete(url,httpOptions);    
  }
}
