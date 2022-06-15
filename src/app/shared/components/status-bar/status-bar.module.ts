import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBarComponent } from './status-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { InsuredHeaderComponent } from 'src/app/features/insured/components/insured-header/insured-header.component';

@NgModule({
  declarations: [ StatusBarComponent, InsuredHeaderComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [StatusBarComponent]

})
export class StatusModule { }
