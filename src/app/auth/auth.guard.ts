import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService} from './auth.service'
import { Observable } from 'rxjs/';
import { tap, map, take } from 'rxjs/operators';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate( ) {
      return this.auth.account$.pipe(
        take(1),
        map(user => !!user),
        tap(loggedIn => {
          if (!loggedIn) {
        //    alert('You must login first')
            this.router.navigate(['auth/login']);
          }
      })
    )
  }
}