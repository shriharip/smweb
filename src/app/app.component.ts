import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service'
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  
  constructor(private auth: AuthService) {

    this.auth.account$.subscribe(data => {
      let user = localStorage.getItem("user");
      if (!user) {
        localStorage.setItem("user", data.uid);
        localStorage.setItem("displayName", data.displayName)
      }
    })
  }

}
