import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ImportComponent
  ],
  imports: [
    CommonModule,
    ImportRoutingModule,
    FormsModule
  ]
})
export class ImportModule { }
