import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '@nebular/auth';
import { StateService } from './../../core/data/state.service'


@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
})
export class RegisterComponent {


  showMessages: any = {};

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  socialLinks: NbAuthSocialLink[] = [];
  validation = {};

  constructor(protected auth: AuthService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router, protected state: StateService) {

   // this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
    this.showMessages = this.getConfigValue('forms.register.showMessages');
    this.socialLinks = this.getConfigValue('forms.register.socialLinks');

    this.validation = this.getConfigValue('forms.validation');
  }

  register = async () => {
    this.errors = this.messages = [];
    this.submitted = true;

    try {
      const user =  await this.auth.register(this.user.email, this.user.password, this.user.fullName, this.user.company)
      
      this.submitted = false;
        this.messages = [];
        // try {
        //   await this.state.setStorage('isOnBoarded', 'false');
        //  this.redirectToOnboard(user.uid)
        // } catch (error) {
        //   console.log( 'setStorage error', error)
        // }
        localStorage.setItem("isOnBoarded", "false");
        this.redirectToOnboard()
       } catch (err) {
      this.submitted = false;
        this.errors = [err];
    }
      
  }

  // loginSocial(name) {
  //   if (name === "google") {
  //     this.loginGoogle();
  //   } else if (name === "facebook") {
  //     this.loginFb();
  //   } else{
  //     console.warn("No login for " + name);
  //   }
  // }

  // loginGoogle() {
  //   this.auth.signInWithGoogle()
  //     .then((success) => {
  //       this.redirectToDashboard()
  //     })
  //     .catch((err) => {
  //       this.errors = [err];
  //     });
  // }

  // loginFb() {
  //   this.auth.signInWithFacebook()
  //     .then((success) => {
  //       this.redirectToDashboard()
  //     })
  //     .catch((err) => {
  //       this.errors = [err];
  //     });
  // }

  redirectToOnboard() {
      this.router.navigate([ '/pages/onboard/']);

  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}