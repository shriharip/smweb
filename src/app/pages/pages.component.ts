import { Component, AfterViewInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {DbService} from './../core/data/firestore.service';
import { AuthService} from './../auth/auth.service';
import { StateService } from './../core/data/state.service'
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/';
import { tap, map, take, filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-pages',
  template: `
  <div > 
  <nb-card [nbSpinner]="true" nbSpinnerSize="xxlarge">
</nb-card>
  </div>
  <div>
  <ngx-sample-layout>

  <nb-menu [items]="menu"> </nb-menu>
     <router-outlet></router-outlet>
      </ngx-sample-layout>

  </div>

  `,
})
export class PagesComponent implements AfterViewInit {
 

  ismenu = true;
  menu = MENU_ITEMS;
 protected show: boolean = false;
  constructor(private db: DbService, private auth: AuthService, private router: Router, 
    protected state:StateService) { 

   
    if(this.router.url.indexOf('onboard') > 0) {
      this.ismenu = false;
    }
    console.log(this.ismenu);

    this.router.events.pipe( 
    filter(event=> event instanceof NavigationStart)).subscribe((event:NavigationStart)=>{
     // TODO
     this.show = false;
     this.redirectToOnboard();
  })
}
redirectToOnboard() {
//  this.auth.user.subscribe(data=> { 
//    if(!data.isOnBoarded) {  
//    this.show = true;
//    this.router.navigate(['pages/onboard'])
//   }
// })
let isOnBoarded = localStorage.getItem("isOnBoarded");
if(isOnBoarded) this.router.navigate(['pages/onboard'])
}

ngAfterViewInit(): void {
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
  this.show = true;
}
}
