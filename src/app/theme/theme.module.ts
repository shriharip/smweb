import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  NbActionsModule,
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbSpinnerModule,
  NbStepperModule
} from '@nebular/theme';

import { NbSecurityModule } from '@nebular/security';

 import {
  FooterComponent,
  HeaderComponent,
//   SearchInputComponent,
//   ThemeSettingsComponent,
//   SwitcherComponent,
//   LayoutDirectionSwitcherComponent,
//   ThemeSwitcherComponent,
//   TinyMCEComponent,
//   ThemeSwitcherListComponent,
 } from './components';

import { SampleLayoutComponent } from './layouts';


const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const NB_MODULES = [
  NbCardModule,
  NbSpinnerModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbUserModule,
  NbMenuModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbStepperModule,
  NbSecurityModule, // *nbIsGranted directive
  Ng2SmartTableModule
];

const COMPONENTS = [
//   SwitcherComponent,
//   LayoutDirectionSwitcherComponent,
//   ThemeSwitcherComponent,
//   ThemeSwitcherListComponent,
   HeaderComponent,
   FooterComponent,
//   SearchInputComponent,
//   ThemeSettingsComponent,
//   TinyMCEComponent,
//   OneColumnLayoutComponent,
   SampleLayoutComponent,
//   ThreeColumnsLayoutComponent,
//   TwoColumnsLayoutComponent,
 ];

// const ENTRY_COMPONENTS = [
//   ThemeSwitcherListComponent,
// ];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'corporate',
    },
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS ],
  declarations: [...COMPONENTS],
  entryComponents: [],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}