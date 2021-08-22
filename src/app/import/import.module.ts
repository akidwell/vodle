import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ImportComponent,
  ],
  imports: [
    CommonModule,
    ImportRoutingModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class ImportModule { }
