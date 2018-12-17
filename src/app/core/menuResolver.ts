import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS } from './../pages/pages-menu'
import { of as observableOf } from 'rxjs';
export interface Resolve<T> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T
  }

@Injectable()
class MenuResolver implements Resolve<NbMenuItem> {
  constructor() {}
 
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return observableOf(MENU_ITEMS);
  }
}
