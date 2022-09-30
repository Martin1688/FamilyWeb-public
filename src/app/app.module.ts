import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from 'src/environments/environment';
import { AddItemComponent } from './add-item/add-item.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButgetComponent } from './butget/butget.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CreatefmlymemberComponent } from './createfmlymember/createfmlymember.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { MonthlistComponent } from './monthlist/monthlist.component';
import { OperateDocComponent } from './operate-doc/operate-doc.component';
import { PayrecordComponent } from './payrecord/payrecord.component';
import { RegisterComponent } from './register/register.component';
import { SuggestComponent } from './suggest/suggest.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MonthlistComponent,
    EditItemComponent,
    LoginComponent,
    RegisterComponent,
    ButgetComponent,
    AddItemComponent,
    PayrecordComponent,
    CreatefmlymemberComponent,
    ForgetpasswordComponent,
    ChangepasswordComponent,
    SuggestComponent,
    OperateDocComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RecaptchaV3Module, 
    PdfViewerModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
