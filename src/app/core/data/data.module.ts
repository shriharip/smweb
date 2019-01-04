import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from './firestore.service'
 
import { StateService } from './state.service';
import { CanDeactivateGuard } from '../can-deactivate.gaurd'
const SERVICES = [

  StateService,
  DbService,
  CanDeactivateGuard
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
