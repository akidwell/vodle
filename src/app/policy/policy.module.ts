import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy.component';

import { PolicyHeaderComponent } from './header/policy-header.component';

@NgModule({
  declarations: [
    PolicyComponent,
    PolicyHeaderComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    FormsModule   
  ]
})
export class PolicyModule { }
