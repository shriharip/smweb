import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { ThemeModule } from '../../theme/theme.module';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule, 
    ThemeModule
  ]
})
export class UsersModule { }
