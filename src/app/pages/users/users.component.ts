
import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { DbService } from './../../core/data/firestore.service';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './users.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class UsersComponent {
users = [];

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
     
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      }, 
      onboard: {
        title: 'onboard',
        type: 'string',
      },   
      role: {
        title: 'Role',
        type: 'string',
      }, 
  }
};
  source: LocalDataSource = new LocalDataSource();
  

  constructor(private db: DbService) {
   this.getData();  
  }

 getData = () => {
    this.db.getUsers().subscribe(data => {
      this.source.load(data);
        })

 }
  onDeleteConfirm(event): void {
    console.log(event)
    if (window.confirm('Are you sure you want to delete?')) {
      this.db.delete(`users/asdfsa2134234sddf234sgd`)  
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {
   this.db.updateAt(`users/asdfsa2134234sddf234sgd`, event.newData, true )
    event.confirm.resolve();
    console.log(event)
  }
}
