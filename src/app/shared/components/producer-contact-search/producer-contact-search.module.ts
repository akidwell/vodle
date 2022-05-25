import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ProducerContactSearch } from './producer-contact-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';

@NgModule({
  declarations: [ ProducerContactSearch ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule
  ],
  exports: [ ProducerContactSearch ],
  providers: [ FormatDateForDisplay ]

})
export class ProducerContactSearchModule { }
