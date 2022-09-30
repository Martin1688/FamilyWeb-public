import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../fservice/admin.service';
import { AuthenticationService } from '../fservice/authentication.service';

@Component({
  selector: 'app-payrecord',
  templateUrl: './payrecord.component.html',
  styleUrls: ['./payrecord.component.css']
})
export class PayrecordComponent implements OnInit {
  disableBtn = false;
  formError: string = '';
  family: { name: string, value: string, email:string } = { value: '', name: '', email:'' };
  paytype: { name: string, value: string } = { name: '', value: '' };
  year: string = '';
  month: string = '';
  cost: number = 0;
  families: { name: string, value: string, email:string }[] = [];
  paytypes: { name: string, value: string }[] = [];
  years: string[] = ['2022', '2023', '2024'];
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  monthBigs = ['01', '03', '05', '07', '08', '10', '12'];
  discount: { value: number, name: string } = { value: 1, name: '原價' };
  discounts: { value: number, name: string }[] = [{ value: 1, name: '原價' }, { value: 0.9, name: '九折' }, { value: 0.8, name: '八折' }, { value: 0.7, name: '七折' }, { value: 0.6, name: '六折' }, { value: 0.5, name: '對折' }];
  prices: dicNo = new dicNo();
  price: number = 0;
  days: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
  bday = "01";
  paymethod = "";
  PayMethods: { value: string, name: string }[] = [{ value: 'CD', name: '信用卡' }, { value: 'CH', name: '現金' }, { value: 'TF', name: '匯款' }, { value: 'OT', name: '其他' }];
  hgt = '300';
  constructor(private admin: AdminService,
    private authenticationService: AuthenticationService) {
    this.prices = { "Y": 600, "S": 160, "M": 60, "T": 0 };
    this.formClear();
  }

  ngOnInit(): void {
    this.adjustInputWidth();

  }
  ListFamilies() {
    this.admin.listFamilies().subscribe((response) => {
      //console.log(response);
      const resuit = response as { message: string, data: { _id: string, familyname: string,email:string }[] };
      this.families = resuit.data.map(item => {
        return { value: item._id, name: item.familyname,email:item.email };
      });
      //console.log(this.families);
      //const ressult = response as {message:string};
      // this.families =response.map(item=>{
      //   return {item.email, item.}
      // })
    });
  }

  CheckYears() {
    const theDate = new Date();
    let theYear = theDate.getFullYear();
    while (this.years.indexOf(theYear.toString()) === -1) {
      this.years.push(theYear.toString());
      theYear--;
    }
  }

  SetPayTypes() {
    this.paytypes = [
      { name: "年付", value: "Y" },
      { name: "季付", value: "S" },
      { name: "月付", value: "M" },
      { name: "試用", value: "T" }
    ];
  }
  SetDays() {
    const yearInt = parseInt(this.year);
    if (this.monthBigs.indexOf(this.month) > -1) {
      this.days = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
    } else if (this.month === "02" && this.leapYear(yearInt)) {
      this.days = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"];
    } else if (this.month === "02") {
      this.days = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"];
    } else {
      this.days = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
    }
    // const monthInt = parseInt(this.month);
    // const dayInt = parseInt(this.bday) - 1;
    // const bdate = new Date(yearInt, monthInt, dayInt);
  }
  leapYear(year: number) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }
  setInit() {
    const theDate = new Date();
    //console.log(this.paytypes);
    this.paytype = { name: '月付', value: 'M' };;
    //console.log(this.paytype);
    this.year = theDate.getFullYear().toString();
    const temstr = "0" + (theDate.getMonth() + 1).toString();
    const idx = temstr.length === 3 ? 1 : 0;
    this.month = temstr.substring(idx, idx + 2);
    const dayStr = "0" + theDate.getDate().toString();
    const id = dayStr.length === 3 ? 1 : 0;
    this.bday = dayStr.substring(id, id + 2);
    // console.log(this.bday);
  }
  formClear() {
    this.CheckYears();
    this.SetPayTypes();
    this.ListFamilies();
    this.SetDays();
    setTimeout(() => {
      this.setInit();
    }, 100);
  }
  onSubmit() {
    this.family.name =this.searchName(this.families, this.family.value);
    this.paytype.name=this.searchName(this.paytypes,this.paytype.value);
    //console.log(this.family.name);
if (!this.family.value) {
      this.formError = "請選擇家庭名稱";
      return;
    } else if (!this.paymethod) {
      this.formError = "請選擇付費方式";
      return;
    }
    this.family.email=this.searchMail(this.families,this.family.value);
    //let { name, email } = this.authenticationService.getCurrentUser();
    const payRec = {
      familycode: this.family.value,
      email: this.family.email,
      amount: this.prices[this.paytype.value] * this.discount.value,
      discount: this.discount.value,
      paymethod: this.paymethod,
      paytype: this.paytype.value,
      actiondate: this.GetActionDate(),
      duedate: this.GetDueDate()
    }
    //console.log(this.family);
    this.admin.savePayRec(payRec).subscribe(
      {
        next: (result) => {
          console.log(result);
          const {message,data}=result as  { message: string, data: any }
          if (message === 'Created') {
            //console.log(data);
            this.formError = `${this.family.name}${this.paytype.name}儲值紀錄完成;`;
            this.formClear();
          }
          else {
            this.formError = message;
          }
        
        },
        error:(err: HttpErrorResponse)=>{
          const errResult = err.error as { message: string, data: any };
          this.formError = errResult.message;
         }
      }
    )

  }
  SetPrice() {
    this.price = this.prices[this.paytype.value] * this.discount.value;
    //(this.paytype);
  }
  GetActionDate() {
    const yearInt = parseInt(this.year.toString());
    const monthInt = parseInt(this.month);
    const dayInt = parseInt(this.bday);
    const aDate = new Date(yearInt, monthInt, dayInt);
    return aDate.getTime() / 1000;
  }
  GetDueDate() {
    const yearInt = parseInt(this.year.toString());
    const monthInt = parseInt(this.month);
    const dayInt = parseInt(this.bday);
    const aDate = new Date(yearInt, monthInt, dayInt);
    let mm = 1;
    if (this.paytype.value === "M") {
      mm = 1;
    } else if (this.paytype.value === "S") {
      mm = 3;
    } else if (this.paytype.value === "Y") {
      mm = 12;
    }
    const dDate = aDate.setMonth(aDate.getMonth() + mm);
    return dDate / 1000;
  }
  //divLength
  adjustInputWidth() {
    const elMemo = document.getElementById('divLength');
    const meDim = elMemo!.getBoundingClientRect();
    this.hgt = meDim.height.toString();

  }
  searchName(ary:{ name: string, value: string }[],ky:string){
    let ret ='';
    ary.every(element=>{
      if(element && element.value===ky){
        ret= element.name;
        return false;
      } else{
        return true;
      }
    });
        //console.log(ret);
    return ret;
  }
  searchMail(ary:{ name: string, value: string, email:string }[],ky:string){
    let ret ='';
    ary.every(element=>{
      if(element && element.value===ky){
        ret= element.email;
        return false;
      } else{
        return true;
      }
    });
        //console.log(ret);
    return ret;
  }  
}
class dicNo {
  [index: string]: number
}

