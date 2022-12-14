import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cunsume } from '../fclass/cunsume';
import { FamilyItem } from '../fclass/family-item';
import { User } from '../fclass/user';
import { AuthenticationService } from '../fservice/authentication.service';
import { FaccountDataService } from '../fservice/faccount-data.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  hgt: string = "62";
  public newConsume: Cunsume | undefined;


  // newConsume= new FormGroup( {
  //   cdate: new FormControl(''),
  //   itemName: new FormControl(''),
  //   price: new FormControl(''),
  //   memo: new FormControl('')
  // });
  public formVisible: boolean = false;
  public formError: string = '';
  familyInfo: FamilyItem | undefined;
  listCunsume: Cunsume[] = [];
  disableBtn = false;
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private dataService: FaccountDataService) {
    this.GetFamily();

  }

  ngOnInit() {
    if (!this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    } else {
      setTimeout(() => {
        this.adjustMemoHeight();
      }, 1000);
    }
    //console.log('additem dedbug');
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
    this.getUsername();
    return this.authenticationService.isLoggedIn();
    //return true;
  }
  public getUsername(): string {
    const user: User = this.authenticationService.getCurrentUser();
    if (user && user.name) {
      this.newConsume!.useremail = user.email;
    }
    return user ? user.name : 'Guest';
  }

  public onConsumeSubmit(): void {
    //console.log('add item');
    let errMsg = '';
    if (this.newConsume!.itemName === '') {
      errMsg += "????????????;"
    }
    if (this.newConsume!.price === '') {
      errMsg += "????????????;"
    }
    if (this.newConsume!.cyear === '') {
      errMsg += "????????????;"
    }
    if (this.newConsume!.cmonth === '') {
      errMsg += "????????????;"
    }
    if (this.newConsume!.cday === '') {
      errMsg += "????????????;"
    }
    if (errMsg !== '') {
      this.formError = errMsg;
      return;
    }
    console.log(this.newConsume!);
    this.disableBtn = true;
    this.dataService.newAccount(this.newConsume!).subscribe(x => {
      const result = x as { message: string, obj: Cunsume };
      if (result.message == 'Created') {
        this.formError = '????????????';
        this.formClear();
        this.disableBtn = false;
      } else {
        this.formError = result.message;
        this.disableBtn = false;
      }

    });

    // //this.familyInfo!.paid === 'N' ??????????????? ????????????this.familyInfo!.paid === 'Y' ??????????????? Martin
    // if (this.familyInfo === undefined || this.familyInfo!.paid === 'Y') {
    //   this.dataService.saveLocalConsume(this.newConsume!);
    //   this.disableBtn = false;
    //   //???listCunsume??????json??????localStorage
    // } else {
    // }
  }


  public formClear(): void {
    // const nowDate: String = new String(new Date().toLocaleString());
    // const dateAry = nowDate.substring(0, nowDate.indexOf(' ')).split('/');
    // nowDate.substr(0,nowDate.indexOf(' '));

    //console.log(nowDate.substr(0,nowDate.indexOf(' ')).split('/'));
    if (this.newConsume) {
      //console.log(this.newConsume);
      this.newConsume!.reset();
    }
    //console.log(this.newConsume);
  }

  public hidedError() {
    this.formError = '';
  }

  GetFamily() {
    const user = this.authenticationService.getCurrentUser();
    if (user) {
      const { familycode, email, name, familyname, role, paid, duedate, paytype } = user;
      this.familyInfo = { familycode, email, name, familyname, role, paid, duedate, paytype };
      this.newConsume = new Cunsume(user.familycode, user.email);
      //console.log(this.familyInfo);
    }
  }

}


