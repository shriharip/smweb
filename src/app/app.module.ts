//angular related

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

//nebular related
import { ThemeModule } from './theme/theme.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//application related
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { PaymentModule } from './payment/payment.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from './../environments/environment';

//Auth
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RequestPasswordComponent } from './auth/request-password/request-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

//Stripe related
import {PaymentService} from './payment/payment.service'

import { TokenInterceptor } from './core/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, RegisterComponent, RequestPasswordComponent, ResetPasswordComponent,
     ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule,
    PaymentModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), AngularFirestoreModule, AngularFireAuthModule,
  ],
  providers: [
    AuthGuard, AuthService, PaymentService,
    {  provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
