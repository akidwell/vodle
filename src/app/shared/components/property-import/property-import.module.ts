import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { PropertyImportComponent } from './property-import.component';
import { BusyModule } from 'src/app/core/components/busy/busy.module';

@NgModule({
  declarations: [PropertyImportComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    BusyModule
  ],
  exports: [PropertyImportComponent]
})
export class PropertyImportModule { }
