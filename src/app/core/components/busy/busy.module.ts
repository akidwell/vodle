import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { BusyComponent } from './busy.component';

@NgModule({
  declarations: [ BusyComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [BusyComponent]

})
export class BusyModule { }
