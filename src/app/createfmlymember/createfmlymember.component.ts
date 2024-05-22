import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BriefUser } from '../fclass/brief-user';
import { FamilyOne } from '../fclass/family-item';
import { User } from '../fclass/user';
import { AdminService } from '../fservice/admin.service';
import { AuthenticationService } from '../fservice/authentication.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-createfmlymember',
  templateUrl: './createfmlymember.component.html',
  styleUrls: ['./createfmlymember.component.css']
})
export class CreatefmlymemberComponent implements OnInit {
  fmly:FamilyOne={familycode:'',aName:'', familyName:'',email:''};
  user:BriefUser ={familycode:'',name:'',role:'',email:''};
  members:BriefUser[] | undefined;
  updateFlag=false;
  mailDisabled=false;
  formError="";
  constructor(private admin: AdminService,
    private auth: AuthenticationService,
    private recaptchaV3Service: ReCaptchaV3Service
    ) { }

  ngOnInit(): void {
    const data =this.auth.getCurrentUser();
    //const {fcode,email,name,familyname}=data;
    this.fmly={familycode:data.familycode,email:data.email,aName:data.name,familyName:data.familyname};
    this.members=[{familycode:data.familycode,name:data.name,role:'admin', email:data.email}];
    this.queryAllUser();
  }
  queryAllUser(){
    this.formError='';
    if(this.fmly!.familycode ===''){
      this.formError='無法讀取家庭碼或尚未申請建立家庭記帳';
    return;
    }
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      this.admin.verifyReCaptcha(token).subscribe((result: { "success": string, 'message': string }) => {
        if (result.success) {
          this.admin.QueryUser(this.fmly!).subscribe(
            {
              next: (result: { message: string, data: any } | any) => {
                if (result.message === 'success') {
                  //let data = JSON.parse(result.data);
                  for(const obj of result.data){
                    if(obj.email!=this.fmly.email){
                      this.members?.push({familycode:obj.familycode, email:obj.email,role:"member",name:obj.name});
                    }
                  }
                  //console.log(result.data);
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
        } else {
          this.formError = result.message;
        }
      });
    });

  }
  editUser(event: MouseEvent,row:any): void{
    this.formError='';
    if(row.role==='member'){
      this.user=row;
      this.mailDisabled=true;
      this.updateFlag=true;
    } else {
      this.formError=`${row.name}是管理人員不可編輯`;
    }
  }

  delUser(event: MouseEvent,row:any): void{
    this.formError='';
    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      this.admin.verifyReCaptcha(token).subscribe((result: { "success": string, 'message': string }) => {
        if (result.success) {
          if(confirm(`確定要刪除用戶(${row.name})?`)){
            this.admin.DelUser(row.email).subscribe(
              {
                next: (result: { message: string, data: string } | any) => {
                  if (result.message === '') {
                    this.formError =`用戶(${row.name})已刪除!`;
                    const idx = this.members!.findIndex(obj => {
                      return obj.email === row.email;
                    });                
                    this.members!.splice(idx, 1);                
                  }            
                },
                error:(err: HttpErrorResponse)=>{
                  const errResult = err.error as { message: string, token: string };
                  this.formError = errResult.message;
                 }
            });        
          }
    
        } else {
          this.formError = result.message;
        }
      });
  
    });


  }
  addSave(){
    this.formError='';
    if(this.user.name===''){
      this.formError+='姓名未填;'
    }
    if(this.user.email===''){
      this.formError+='Email未填;'
    }
    if(this.formError ===''){
      this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        this.admin.verifyReCaptcha(token).subscribe((result: { "success": string, 'message': string }) => {
          console.log(result);
          if (result.success) {
            this.user.familycode = this.fmly.familycode;
            this.user.role='member';
            console.log(this.user);
            this.admin.CreatUser(this.user).subscribe(
              {
                next: (result: { message: string, data: string } | any) => {
                  if (result.message === '') {
                    //let data = JSON.parse(result.data);
                    this.members?.push(this.user);
                    this.cancels(`已新增用戶${this.user.name}，密碼：${result.data}`);
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
      
          } else {
            this.formError = result.message;
          }
        });
      });



    }
  }
  editSave(){
    this.formError='';
    if(this.user.name===''){
      this.formError+='姓名不可空白;';
      return ;
    }
    if(this.user.email===''){
      this.formError+='無Email不可編輯;';
      this.cancel();
      return;
    }

    this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      this.admin.verifyReCaptcha(token).subscribe((result: { "success": string, 'message': string }) => {
        //console.log(result);
        if (result.success) {
          this.admin.UpdateUser(this.user).subscribe(
            {
              next: (rlt: { message: string, data: string } | any) => {
                if (rlt.message === '') {
                  this.cancel();
                  this.formError =rlt.data;
                }
                else {
                  this.formError = rlt.message;
                }
              
              },
              error:(err: HttpErrorResponse)=>{
                const errResult = err.error as { message: string, token: string };
                this.formError = errResult.message;
               }
          });
        } else {
            this.formError = result.message;
          }
      });
    });
  this.mailDisabled=false;
  }
  cancel(){
    this.updateFlag=false;
    this.user = new User();
    this.mailDisabled=false;
    
  }
  cancels(msg:string){
    this.cancel();
    this.formError=msg;
  }
  resetPassword(){
    ;
  }
}
