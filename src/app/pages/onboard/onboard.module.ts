import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardComponent } from './onboard.component';
import { ThemeModule } from '../../theme/theme.module';

@NgModule({
  declarations: [OnboardComponent],
  imports: [
    CommonModule,
    ThemeModule
  ]
})
export class OnboardModule { }
