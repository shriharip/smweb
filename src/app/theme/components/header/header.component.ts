import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
//import { UserService } from '../../../@core/data/users.service';
import { AuthService } from '../../../auth/auth.service';

import {filter, tap, map, take} from 'rxjs/operators'

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';
  user: any;

  userMenu = [{ title: 'Profile', link:['pages/profile'] }, { title: 'LogOut' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private auth: AuthService
              ) {

                
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.auth.account$.pipe(take(1), map(user => this.user = user));

    // this.menuService.onItemClick()
    // .pipe(
    //   filter(({ tag }) => tag == 'user-menu'),
    //   map(({ item: { title } }) => title),
    //   tap(title => {
    //     console.log(title);
    //      if(title == 'LogOut' ) {
    //          this.auth.signOut()
    //      }  
    //   })
    // )

    this.menuService.onItemClick().subscribe(data => { 
      if(data.item.title == 'LogOut'){
        this.auth.signOut()
      }})
  }


  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {//
    this.menuService.navigateHome();
  }

 
  startSearch() {
 //   this.analyticsService.trackEvent('startSearch');
  }

}
