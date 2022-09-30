import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Para } from '../fclass/para';
import { User } from '../fclass/user';
import { AdminService } from '../fservice/admin.service';
import { AuthenticationService } from '../fservice/authentication.service';
import { FaccountAnalystService } from '../fservice/faccount-analyst.service';

@Component({
  selector: 'app-butget',
  templateUrl: './butget.component.html',
  styleUrls: ['./butget.component.css']
})
export class ButgetComponent implements OnInit {
  formError = '';
  currentUser: User | undefined;
  isShowMain = true;
  cyear = '';
  cmonth = '';
  cincome = 0;
  cmember = '';
  incomeTitle = '';
  viewModel = {
    'years': ['2020'],
    'months': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    'users': [{ key: 'all', value: 'all' }]
  };
  fmlyUsers=[];
  fmIncomes: any[] = [];
  fmIncomesShow = false;
  paraMartin: Para = {
    paraName: '',
    paraType: 'monthBudget',
    paraText: '',
    paraNo: 0,
    paraMemo: 'Martin'
  };

  paraKaty: Para = {
    paraName: '',
    paraType: 'monthBudget',
    paraText: '',
    paraNo: 0,
    paraMemo: 'Katy'
  };
  hgt = '20';
  constructor(private admin: AdminService, private analystService: FaccountAnalystService, private auth: AuthenticationService) {
    //this.SetYearMonth();
  }
  paraAll: any = [];
  ngOnInit() {
    this.adjustInputWidth();
    this.checkViewModel();
    const dd = new Date();
    this.cyear = dd.getFullYear().toString();
    this.cmonth = (dd.getMonth() + 1).toString();
    this.cmonth = this.cmonth.length === 1 ? '0' + this.cmonth : this.cmonth;
    setTimeout(() => {
      this.cmember=this.currentUser!.email;
    }, 500);
    //console.log(this.cmonth);
    //this.queryIncomes();
  }

  adjustInputWidth() {
    const elMemo = document.getElementById('divLength');
    const meDim = elMemo!.getBoundingClientRect();
    this.hgt = meDim.height.toString();

  }
  checkViewModel() {
    const data = this.auth.getCurrentUser();
    this.currentUser = {
      familycode: data.familycode,
      email: data.email,
      name: data.name,
      familyname: data.familyname,
      role: data.role,
      paid: data.paid,
      duedate: data.duedate,
      password: '',
      paytype: '',
      keep: false
    };
    //this.model.familycode=data.familycode;                
    const numYr1st = Number.parseInt(this.viewModel.years[0]);
    const currentYr = new Date().getFullYear();
    let yr = numYr1st + 1;
    while (yr <= currentYr) {
      this.viewModel.years.push(yr.toString());
      yr = yr + 1;
    }
    this.checkViewModelUsers();
  }
  checkViewModelUsers() {
    if (this.currentUser!.familycode !== '') {
      const fmly = {
        familycode: this.currentUser!.familycode,
        email: this.currentUser!.email,
        aName: this.currentUser!.name,
        familyName: this.currentUser!.familyname
      }
      //console.log(fmly);
      this.admin.QueryUser(fmly!).subscribe(
        {
          next: (result: { message: string, data: any } | any) => {
            if (result.message === 'success') {
              //console.log(result.data);
              this.fmlyUsers=result.data;
              this.viewModel.users = [];
              for (const obj of result.data) {
                if(this.currentUser?.role === 'admin'){
                  this.viewModel.users.push({ key: obj.name, value: obj.email });
                } else if( this.currentUser?.email === obj.email){
                  this.viewModel.users.push({ key: obj.name, value: obj.email });
                }
              }
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
  }

  GetYearMonth() {
    const yrMonth = this.cyear + (this.cmonth.length === 1 ? '0' + this.cmonth : this.cmonth);
    return yrMonth;
  }

  queryIncomes() {
    this.formError = '';
    this.analystService.queryIncomes(this.currentUser!.familycode, this.cyear + this.cmonth).subscribe({
      next: (result: any) => {
        console.log(result);
        const { message, data } = result as { message: string, data: any[] };
        if (message === 'success' && data.length > 0) {
          this.fmIncomes = data;
          document.getElementById("mainForm")!.style.display = 'none';
          this.fmIncomesShow = this.fmIncomes.length > 0;
        } else {
          this.formError=`${this.cyear}年${this.cmonth}月尚未設定收入資料!!`;
        }
      },
      error: (err: HttpErrorResponse) => {
        const errResult = err.error as { message: string, token: string };
        this.formError = errResult.message;
      }
    });
  }

  setIncome() {
    this.formError = '';
    if (this.cmember === '') {
      this.formError += '請選取成員;';
    }
    if (this.incomeTitle === '') {
      this.formError += '請輸入來源;';
    }
    if (this.cincome === 0) {
      this.formError += '請輸入金額;';
    }
    if (this.formError === '') {
      const { familycode } = this.auth.getCurrentUser();
      const obj = {
        familycode: familycode,
        useremail: this.cmember,
        incometitle: this.incomeTitle,
        amount: this.cincome,
        yearmonth: this.cyear + this.cmonth,
      }
      console.log(obj);
      this.analystService.setIncome(obj).subscribe({
        next: (result: any) => {
          //console.log(result);
          const { message } = result;
          if (message === 'success') {
            this.formError = '收入設定完成;';
            this.incomeTitle = '';
            this.cincome = 0;
          }
        },
        error: (err: HttpErrorResponse) => {
          const errResult = err.error as { message: string, data: any };
          this.formError = errResult.message;
        }
      });

    }
  }
  searchName(ky: string) {
    let ret = '';
    this.viewModel.users.every(element => {
      if (element && element.value === ky) {
        ret = element.key;
        return false;
      } else {
        return true;
      }
    });
    //console.log(ret);
    return ret;
  }

  MartinBlur() {
    this.paraKaty.paraNo = this.paraMartin.paraNo;
  }
  clearButdge() {
    document.getElementById("mainForm")!.style.display = 'block';
    this.fmIncomes = [];
    this.fmIncomesShow = false;
    this.formError='';
  }

  delIncome(item: any) {
    this.formError = '';
    const uName = this.searchName(item.useremail);
    if (confirm(`確定要刪除${uName}(${item.yearmonth})的${item.incometitle}?`)) {
      this.analystService.delIncome(item._id).subscribe({
        next: (result: any) => {
          const { message } = result;
          if (message === 'success') {
            this.formError = `${uName}(${item.yearmonth})的${item.incometitle}刪除成功;`;
            for (var i = 0; i < this.fmIncomes.length; i++) {

              if (this.fmIncomes[i]._id === item._id) {

                this.fmIncomes.splice(i, 1);
              }

            }
          } else {
            this.formError = message;
          }
        },
        error: (err: HttpErrorResponse) => {
          const errResult = err.error as { message: string, data: any };
          this.formError = errResult.message;
        }
      });
    }
  }

  email2Name(mail:string){
    let ret='';
    for(let i = 0; i < this.fmlyUsers.length; i++){
      const obj= this.fmlyUsers[i] as User;
      if(obj.email === mail){
        ret=obj.name;
      }
    }
    return ret;
  }
}

