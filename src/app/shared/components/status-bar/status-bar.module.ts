import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBarComponent } from './status-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { InsuredHeaderComponent } from 'src/app/features/insured/components/insured-header/insured-header.component';
import { PolicyHeaderComponent } from 'src/app/features/policy/components/policy-header/policy-header.component';
import { DirectivesModule } from '../../directives/directives.module';
import { InsuredDuplicatesComponent } from 'src/app/features/insured/components/insured-duplicates/insured-duplicates.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [ StatusBarComponent, InsuredHeaderComponent, PolicyHeaderComponent, InsuredDuplicatesComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    DirectivesModule,
    PipesModule
  ],
  exports: [StatusBarComponent]

})
export class StatusModule { }
