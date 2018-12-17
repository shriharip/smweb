import { Component } from '@angular/core';
import { DbService } from './core/data/firestore.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(private db: DbService) {
  //  this.getUsers();
  }
  getUsers = async ()=> {
    this.db.getUsers();
       
   }
  

}
