import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

import {OnboardComponent} from './onboard/onboard.component'
import { UsersComponent } from './../pages/users/users.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent, 
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  }, {
    path: 'users',
    component: UsersComponent,
  },{ 
    path: 'onboard', 
    component: OnboardComponent 
  }, 
   {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule], 
})
export class PagesRoutingModule {
}
