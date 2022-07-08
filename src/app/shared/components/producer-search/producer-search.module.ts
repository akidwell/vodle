import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ProducerSearch } from './producer-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';

@NgModule({
  declarations: [ ProducerSearch ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule
  ],
  exports: [ ProducerSearch ],
  providers: [ FormatDateForDisplay ]

})
export class ProducerSearchModule { }
