import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FamilyItem } from '../fclass/family-item';
import { User } from '../fclass/user';
import { AdminService } from '../fservice/admin.service';
import { AuthenticationService } from '../fservice/authentication.service';

@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.component.html',
  styleUrls: ['./suggest.component.css']
})
export class SuggestComponent implements OnInit {
  hgt: string = "62";
  public formError: string = '';
  familyInfo: FamilyItem | undefined;
  opinion: Opinion | undefined;
  opinions:Opinion[]=[];
  user: User | undefined;
  edited=false;
  constructor(private admin: AdminService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getCurrentUser();
    //console.log(this.user);
    this.initOpinion();
    setTimeout(() => {
      this.adjustMemoHeight();
    }, 1000);
    this.getOpinions();
  }
  adjustMemoHeight() {
    if (this.familyInfo) {
      const elMemo = document.getElementById('memo');
      const meDim = elMemo!.getBoundingClientRect();
      this.hgt = meDim.height.toString();
      //elMemo!.previousElementSibling!.setAttribute('height',  meHeight.toString()+'px');
      //console.log(this.hgt + 'px');
    }
  }
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
  onSuggestSubmit() {
    this.opinion!.dttime= this.admin.getDateTimeStr();
    // console.log(this.opinion?.dttime);
    this.admin.SuggestCreate(this.opinion).subscribe({
      next: (result: any) => {
        //console.log(JSON.stringify(result));
        if (result.message === '') {
          const op=result.data;
          this.opinions.push(op);
          this.formError = '已收到您珍貴的意見，將會在改版時，研討其可行性，謝謝!!';
          this.initOpinion();
        } else {
          this.formError=result.message;
        }
      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, token: string };
        this.formError = errResult.message;
        console.log(JSON.stringify(err));
      }
    });
  }
  public hidedError() {
    this.formError = '';
  }
  initOpinion(){
    this.opinion = new Opinion(); //{ email: this.user!.email, advice: '', explain: '', dttime: '', ans: '' };
    this.opinion.email = this.user!.email;
    this.opinion.username = this.user!.name;
    this.edited=false;
  }
  getOpinions(){
    this.admin.SuggestQuery(this.opinion).subscribe({
      next:(result:any)=>{
        const {message, data} = result;
        if(message===''){
          this.opinions = data;
          //(this.opinions);
        }
      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, token: string };
        this.formError = errResult.message;
        console.log(JSON.stringify(err));
      }
    })
  }

  delOpinion(row:Opinion){
    this.admin.SuggestDelete(row._id).subscribe({
      next: (result: any) => {
        //console.log(JSON.stringify(result));
        const idx = this.opinions.indexOf(row);
        //console.log(idx);
        this.opinions.splice(idx, 1);  
        // if (result.message === '') {
        //   this.formError = '已收到您珍貴的意見，將會在改版時，研討其可行性，謝謝!!';
        //   this.initOpinion();
        // } else {
        //   this.formError=result.message;
        // }
      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, token: string };
        //this.formError = errResult.message;
        console.log(JSON.stringify(err));
      }

    });
  }

  editOpinion(row:Opinion){
    this.opinion=row;
    this.edited=true;
  }


  localDate(dtStr:string){
    let ret=dtStr.substring(0,8);
    ret = ret.substring(0,6)+'/'+ret.substring(6);
    ret = ret.substring(0,4)+'/'+ret.substring(4);
    return ret;
  }
  isSystemAdmin(){
    return this.user?.role === 'SystemAdmin';
  }

  isOriginalUser(row:Opinion){
    return row.email === this.user?.email;
  }
  editSave(){
    this.admin.SuggestUpdate(this.opinion).subscribe({
      next: (result: any) => {
        console.log(JSON.stringify(result));
        if (result.message === '') {
          const op=result.data;
          //this.opinions.push(op);
          this.formError = `${op.advice}已修改!!`;
          this.initOpinion();
        } else {
          this.formError=result.message;
        }
      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, token: string };
        this.formError = errResult.message;
        console.log(JSON.stringify(err));
      }

    })
  }

  cancel(){
    this.initOpinion();
  }

}


class Opinion {
  _id = "";
  email = "";
  advice = "";
  explain = "";
  dttime = "";
  username = "";
  ans = "";//感謝您提供寳貴意見，會在改版時將您的意見列入討論。
}
