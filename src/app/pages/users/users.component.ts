
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
     
      fullName: {
        title: 'FullName',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      }
};
  source: LocalDataSource = new LocalDataSource();
  
  compId: string;

  constructor(private db: DbService) {
    let uid = localStorage.getItem("user");
    let displayName = localStorage.getItem("displayName");
    this.compId = displayName.charCodeAt(0) + displayName.charCodeAt(1) + uid;
   this.getData();  
  }

 getData = () => {
    this.db.getUsers(this.compId).subscribe(data => {
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
    event.newData.send = true
     event.newData.compId = this.compId
   this.db.updateAt('users', event.newData, true )
   event.confirm.resolve();
    console.log(event)
  }
}
