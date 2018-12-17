import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import {DbService} from './../core/data/firestore.service';
import { AuthService} from './../auth/auth.service';

import { Router } from '@angular/router';
import { Observable } from 'rxjs/';
import { tap, map, take, first } from 'rxjs/operators';

@Component({
  selector: 'ngx-pages',
  template: `
  <div *ngIf="!show"> 
  <nb-card [nbSpinner]="true" nbSpinnerSize="xxlarge">
</nb-card>
  </div>
  <div *ngIf="show">
  <ngx-sample-layout>

  <nb-menu [items]="menu"> </nb-menu>
     <router-outlet></router-outlet>
      </ngx-sample-layout>

  </div>

  `,
})
export class PagesComponent {
 

  ismenu = true;
  menu = MENU_ITEMS;
 protected show: boolean = false;
  constructor(private db: DbService, private auth: AuthService, private router: Router) { 
    // this.auth.account$.pipe( 
    //   map(account => account.uid), 
    //   map(uid => { this.db.doc$(`users/${uid}`).pipe(
    //     map(({onboard})=> {
    //       if (onboard){
    //         this.router.navigate(['onboard'])
    //       }
    //     })
    //   ) })
    // )
   
    if(this.router.url.indexOf('onboard') > 0) {
      this.ismenu = false;
    }
    console.log(this.ismenu);
    this.auth.account$.subscribe( account => {
      let uid = account.uid; 
      this.db.doc$(`users/${uid}`).subscribe(doc => {
        if (doc.onboard){
          this.show = true;
          this.router.navigate(['pages/onboard', uid])
        }else{
          this.show = true;
        }
      }) 
    //   map(doc => {
    //     if (doc['data']) {

    //       if (doc['data'].onboard) {
    //         this.router.navigate(['onboard'])
    //       }
    //     }
    //   }),
    //   )
    // });
  })
}
}
