import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RemoveCommaPipe } from './remove-comma.pipe';
import { BusyModule } from '../busy/busy.module';

@NgModule({
  declarations: [
    ImportComponent,
    RemoveCommaPipe
  ],
  imports: [
    CommonModule,
    ImportRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    ReactiveFormsModule,
    BusyModule
  ],
  providers: [DecimalPipe]
})
export class ImportModule { }
