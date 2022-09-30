import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { ButgetComponent } from './butget/butget.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CreatefmlymemberComponent } from './createfmlymember/createfmlymember.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { MonthlistComponent } from './monthlist/monthlist.component';
import { OperateDocComponent } from './operate-doc/operate-doc.component';
import { PayrecordComponent } from './payrecord/payrecord.component';
import { RegisterComponent } from './register/register.component';
import { SuggestComponent } from './suggest/suggest.component';

const routes: Routes = [
  {
    path:'',
    component:HomepageComponent
  },
  {
    path: 'monthlist',
    component: MonthlistComponent
  },
  {
    path: 'login',
    component: LoginComponent
    },
    {
      path: 'register',
      component: RegisterComponent
    },
    {
      path: 'createmember',
      component: CreatefmlymemberComponent
    },
    {
      path: 'monthbudget',
      component: ButgetComponent
    },
    {
      path: 'additem',
      component: AddItemComponent
    },
    {
      path: 'income',
      component: ButgetComponent
    },
    {
      path: 'payrecord',
      component: PayrecordComponent
    },
    {
      path: 'changepws',
      component: ChangepasswordComponent
    },
    {
      path: 'forgetpws',
      component: ForgetpasswordComponent
    },
    {
      path: 'suggest',
      component: SuggestComponent
    } ,
    {
      path: 'opdoc',
      component: OperateDocComponent
    } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
