import { Component, OnInit } from '@angular/core';
import { Cunsume } from '../fclass/cunsume';
import { FamilyItem } from '../fclass/family-item';
import { User } from '../fclass/user';
import { AuthenticationService } from '../fservice/authentication.service';
import { FaccountDataService } from '../fservice/faccount-data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  hgt:string="62";
  public newConsume: Cunsume | undefined ;
  // newConsume= new FormGroup( {
  //   cdate: new FormControl(''),
  //   itemName: new FormControl(''),
  //   price: new FormControl(''),
  //   memo: new FormControl('')
  // });
  familyName='';
  public formVisible: boolean = false;
  public formError: string='';
  familyInfo:FamilyItem | undefined;
  listCunsume:Cunsume[]=[];
  constructor(private authenticationService: AuthenticationService,
    private dataService: FaccountDataService) { }

  ngOnInit() {
    this.formClear();
    this.familyName=this.authenticationService.getFamilyName();
    //console.log(this.familyName);

    // setTimeout(() => {
    //   this.adjustMemoHeight();
    // }, 1000);
    
  }
  // adjustMemoHeight() {
  //   const elMemo =document.getElementById('memo');
  //  const meDim =elMemo!.getBoundingClientRect();
  //  this.hgt = meDim.height.toString();
  //  //elMemo!.previousElementSibling!.setAttribute('height',  meHeight.toString()+'px');
  //  console.log( this.hgt+'px');
  // }
  public isLoggedIn(): boolean {
    this.getUsername();
    return this.authenticationService.isLoggedIn();
    //return true;
  }
  public getUsername(): string {
    const user: User = this.authenticationService.getCurrentUser();
    if (user && user.name) {
      this.newConsume!.useremail = user.email;
      this.newConsume!.familycode = user.familycode;
    }
    return user ? user.name : 'Guest';
  }

  public onConsumeSubmit(): void {
    let errMsg = '';
    if (this.newConsume!.itemName === '') {
      errMsg += "名稱未填;"
    }
    if (this.newConsume!.price === '') {
      errMsg += "價錢未填;"
    }
    if (this.newConsume!.cyear === '') {
      errMsg += "買年未填;"
    }
    if (this.newConsume!.cmonth === '') {
      errMsg += "買月未填;"
    }
    if (this.newConsume!.cday === '') {
      errMsg += "買日未填;"
    }
    if (errMsg !== '') {
      this.formError = errMsg;
      return;
    }
    //console.log(this.familyInfo);
    if(this.familyInfo === undefined){
      this.dataService.saveLocalConsume(this.newConsume!);
      //將listCunsume轉為json存入localStorage
    } else{
      this.dataService.newAccount(this.newConsume!).subscribe(x=>{
      const result = x as {message:string, obj:Cunsume};
        if (result.message == 'Created') {
          this.formError = '新增成功';
          this.formClear();
        } else {
          this.formError = result.message;
        }

    });
    }
  }


  public formClear(): void {
    const nowDate: String = new String(new Date().toLocaleString());
    const dateAry = nowDate.substr(0, nowDate.indexOf(' ')).split('/');
    // nowDate.substr(0,nowDate.indexOf(' '));

    //console.log(nowDate.substr(0,nowDate.indexOf(' ')).split('/'));
    this.newConsume?.reset;
    //console.log(this.newConsume);
  }

  public hidedError() {
    this.formError = '';
  }


}
