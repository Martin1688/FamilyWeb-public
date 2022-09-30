import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
//import { ResourceLimits } from 'worker_threads';
import { Cunsume } from '../fclass/cunsume';
import { Dictionary } from '../fclass/kvalue';
import { Para } from '../fclass/para';
import { User } from '../fclass/user';
import { AdminService } from '../fservice/admin.service';
import { AuthenticationService } from '../fservice/authentication.service';
import { FaccountAnalystService } from '../fservice/faccount-analyst.service';
import { FaccountDataService } from '../fservice/faccount-data.service';

@Component({
  selector: 'app-monthlist',
  templateUrl: './monthlist.component.html',
  styleUrls: ['./monthlist.component.css']
})
export class MonthlistComponent implements OnInit {

  viewModel = {
    "years": ['2020'],
    'months': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    'users': [{ key: 'all', value: 'all' }]
  };
  model = {
    'familycode': '',
    'cyear': '',
    'cmonth': '',
    'user': { key: 'all', value: 'all' }
  }
  summary = {
    'martin': 0,
    'katy': 0,
    'monthSum': 0,
    'remainder': 0,
    'budget': 100000
  }
  summaryText = {
    'martinText': '',
    'katyText': '',
    'monthText': '',
    'remainderText': '',
    'title': '',
    'budget': ''
  }
  currentUser: User | undefined;
  theList: Dictionary | undefined;
  totalList: Dictionary | undefined;
  total: number = 0;
  butget: number = 0;
  // martinList: Cunsume[] | undefined;
  // katyList: Cunsume[] | undefined;
  theSelected: Cunsume | undefined;
  formError: string = '';
  showMain = true;
  constructor(private admin: AdminService, private auth: AuthenticationService, private analystService: FaccountAnalystService, private dataService: FaccountDataService) { }
  //
  ngOnInit() {
    const theDate = new Date();
    this.checkViewModel();
    this.model.cyear = theDate.getFullYear().toString();
    this.model.cmonth = (theDate.getMonth() + 1).toString();
    // setTimeout(() => {
    //   this.monthBudget();
    // }, 100);
    // console.log(this.theList);
  }

  listIncome() {

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
    this.model.familycode = data.familycode;
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
              for (const obj of result.data) {
                this.viewModel.users.push({ key: obj.name, value: obj.email });
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
  onSubmit() {
    //console.log(this.model);
    //this.model.familycode=this.currentUser!.familycode;
    //console.log(this.model);
    this.analystService.readMonthItems(this.model).subscribe(
      {
        next: (result: { message: string, data: any } | any) => {
          //console.log(result.data);
          if (result.message === 'success') {
            if(result.data.length > 0){
              this.theList = new Dictionary();
              if (this.model.user.key === 'all') {
                for (const obj of result.data) {
                  //console.log(obj.useremail);
                  if (this.theList[obj.useremail] != null) {
                    this.theList[obj.useremail].push(obj as Cunsume);
                  } else {
                    this.theList[obj.useremail] = [];
                    this.theList[obj.useremail].push(obj as Cunsume);
                  }
                }
              } else {
                for (const obj of result.data) {
                  if (obj.useremail === this.model.user.key) {
                    if (this.theList[obj.useremail] != null) {
                      this.theList[obj.useremail].push(obj as Cunsume);
                    } else {
                      this.theList[obj.useremail] = [];
                      this.theList[obj.useremail].push(obj as Cunsume);
                    }
                  }
                }
  
              }  
            } else {
              this.formError=`${this.model.cyear}年${this.model.cmonth}月 查無帳務資料`;
            }
            console.log(result.data);
          }
          else {
            this.formError = result.message;
          }

        },
        error: (err: HttpErrorResponse) => {
          const errResult = err.error as { message: string, token: string };
          this.formError = errResult.message;
        }
      }
    );
  }
  monthTotal() {
    //console.log(this.model);
    this.queryIncomes();
    this.analystService.readMonthItems(this.model).subscribe(
      {
        next: (result: { message: string, data: any } | any) => {
          //console.log(result);
          if (result.message === 'success') {
            //console.log(this.model.user.value);
            if(result.data.length > 0){
              this.totalList = new Dictionary();
              let temList = new Dictionary();
              for (const obj of result.data) {
                //console.log(obj);
                if (temList[obj.useremail] != null) {
                  temList[obj.useremail].push(obj as Cunsume);
                  this.totalList[obj.useremail].price += obj.price;
                } else {
                  temList[obj.useremail] = [];
                  temList[obj.useremail].push(obj as Cunsume);
                  this.totalList[obj.useremail] = { title: this.mail2name(obj.useremail), email: obj.useremail, price: obj.price };
                }
                this.total += obj.price;
              }
              //console.log(this.totalList);  
            } else {
              this.formError=`${this.model.cyear}年${this.model.cmonth}月 查無帳務資料`;
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
      }
    );

  }

  queryIncomes() {
    //const {familycode} = this.currentUser!.familycode;
    //console.log(this.currentUser!.familycode);
    const yrmonth = this.model.cyear + (this.model.cmonth.length === 1 ? '0' + this.model.cmonth : this.model.cmonth);
    //console.log(yrmonth);
    this.butget = 0;
    this.analystService.queryIncomes(this.currentUser!.familycode, yrmonth).subscribe({
      next: (result: { message: string, data: any } | any) => {
        if (result.message === 'success') {
          for (const item of result.data) {
            const price = Number(item.amount.toString());
            //console.log(price); 
            this.butget += price;
          }
        }

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });

  }

  // monthBudget() {
  //   const model: Para = {
  //     paraType: 'monthBudget',
  //     paraName: this.GetYearMonth(),
  //     paraText: '',
  //     paraNo: 0,
  //     paraMemo: ''
  //   }
  //   this.analystService.getParasByName(model).subscribe({
  //     next: (result: any) => {

  //     },
  //     error: (err: HttpErrorResponse) => {

  //     }

  //   });
    // .then(Response => {
    //   //console.log(model);
    //   //console.log(Response.data);
    //   if (Response.data.length === 1) {
    //     this.summary.budget = 100000;
    //   } else if (Response.data.length > 1) {
    //     this.summary.budget = Response.data[0].paraNo + Response.data[1].paraNo;
    //   }
    // });
  //}
  mail2name(email: string) {
    //console.log(email);
    const ret = this.viewModel.users.filter(item => { return item.value === email ? item.key : ''; });
    //console.log(ret);
    const retStr = ret ? ret[0].key : '';
    return retStr + ' ';
  }
  GetYearMonth() {
    const yrMonth = this.model.cyear + (this.model.cmonth.length === 1 ? '0' + this.model.cmonth : this.model.cmonth);
    return yrMonth;
  }
  strFormat(obj: Cunsume) {
    return ` ${obj.cyear}/ ${obj.cmonth}/ ${obj.cday}`;
  }

  sum = function (items: any, prop: string) {
    return items.reduce(function (a: number, b: any) {
      return a + b[prop];
    }, 0);
  };

  goQuery() {
    // this.martinList = [];
    // this.katyList = [];
    this.totalList = undefined;
    this.theList = undefined;
    this.summary.martin = 0;
    this.summary.katy = 0;
    this.summary.monthSum = 0;
    this.summary.remainder = 0;
    this.formError = '';
  }

  onClickEvent(event: MouseEvent, row: Cunsume) {
    this.theSelected = row;
    //console.log(this.theSelected);
    const cMenu = document.getElementById('contextMenu');

    cMenu!.style.display = cMenu!.style.display === 'block' ? 'none' : 'block';
    cMenu!.style.left = event.clientX.toString() + 'px';
    cMenu!.style.top = event.clientY.toString() + 'px';
  }
  onItemEvent(para: string) {
    document.getElementById('contextMenu')!.style.display = 'none';
    if (this.theSelected!.useremail != this.auth.getCurrentUser().email) {
      this.formError = "不能修改或刪除別人建立的帳目";
      return;
    }
    if (para === 'edit') {
      this.showMain = false;
    } else {
      if(confirm(`確定要刪除${this.theSelected!.itemName}?`)){
        this.dataService.delItem(this.theSelected!._id!).subscribe({
          next: (result: any) => {
            this.formError = `${this.theSelected!.itemName} 金額:${this.theSelected!.price} 已刪除`;
            this.onSubmit();
  
          },
          error: (err: HttpErrorResponse) => {
            this.formError = `${this.theSelected!.itemName} 金額:${this.theSelected!.price} 刪除失敗`;
          }
        })
  
      }
    }
  }

  getEditResult(ret: boolean) {
    if (ret) {
      this.formError = `名稱：[${this.theSelected!.itemName}] 已修改`;
      this.onSubmit();
    } else {
      this.formError = `名稱：[${this.theSelected!.itemName}] 取消修改`;
    }
    const user = this.auth.getCurrentUser();
    this.theSelected = new Cunsume(user.familycode, user.email);
    this.showMain = true;
  }
}
function next(next: any, arg1: (result: any) => void, error: any, arg3: (err: HttpErrorResponse) => void) {
  throw new Error('Function not implemented.');
}

