import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms'


import { StripePipe } from './stripe.pipe';
import { KeysPipe } from './keys.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

  ],
  declarations: [ StripePipe, KeysPipe ],
  exports: [ StripePipe, FormsModule, KeysPipe]
})
export class SharedModule { }