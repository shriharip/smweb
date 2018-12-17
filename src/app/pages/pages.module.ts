import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

import { OnboardModule } from './onboard/onboard.module';
import { UsersModule } from './users/users.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    OnboardModule,
    MiscellaneousModule,
    UsersModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
