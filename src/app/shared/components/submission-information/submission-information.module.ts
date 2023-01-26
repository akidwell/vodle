import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { SubmissionHeaderComponent } from 'src/app/features/submission/components/submission-header/submission-header.component';
import { SubmissionInfoPanelLeftComponent } from 'src/app/features/submission/components/submission-info-panel-left/submission-info-panel-left.component';
import { SubmissionInfoPanelRightComponent } from 'src/app/features/submission/components/submission-info-panel-right/submission-info-panel-right.component';
import { SubmissionInformationComponent } from './submission-information.component';
import { ProducerContactSearchModule } from '../producer-contact-search/producer-contact-search.module';
import { ProducerSearchModule } from '../producer-search/producer-search.module';
import { AdditionalNamedInsuredModule } from '../additional-named-insured/additional-named-insured.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SubmissionInformationComponent,
    SubmissionHeaderComponent,
    SubmissionInfoPanelLeftComponent,
    SubmissionInfoPanelRightComponent
  ],
  imports: [
    CommonModule,
    AdditionalNamedInsuredModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    DirectivesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    PipesModule,
    BusyModule,
    ProducerSearchModule,
    ProducerContactSearchModule,
    RouterModule
  ],
  exports: [SubmissionInformationComponent]

})
export class SubmissionInformationModule { }
