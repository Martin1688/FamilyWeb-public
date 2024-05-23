import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../fservice/admin.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  model = new FormGroup({
    email:new FormControl(null,Validators.required)
  });
  public formError: string = '';
  changedOK = false;
  constructor(private admin: AdminService) {
    //this.formError="新密碼將寄到註冊的email信箱，請輸入email：";
    this.formError="輸入email以便變更密碼!";
   }

  ngOnInit(): void {
  }
  onChangePassword(){

    this.formError='';
    if(!this.model.controls['email'].value){
      this.formError='新密碼未填;';
    } else{
      this.admin.ForgetPws(this.model.value).subscribe({
        next: (result: { message: string, data: any } | any) => {
          if (result.message === 'success') {
              this.formError=result.data;
              this.changedOK = true;
              this.model.setValue({'email':null});
            }
          else {
            this.formError = result.message;
          }
        
        },
        error:(err: HttpErrorResponse)=>{
          const errResult = err.error as { message: string, token: string };
          this.formError = errResult.message;
         }

      });
    }
  }
}
