import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from '../../core/constants/date-format';
import { HomeComponent } from './components/home/home.component';
import { ActionComponent } from './components/action/action.component';
import { DirectPolicyComponent } from './components/direct-policy/direct-policy.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SearchModule } from 'src/app/shared/components/search-bar/search-bar.module';
import { InsuredSearchResultsComponent } from './components/insured-search-results/insured-search-results.component';
import { PolicySearchResultsComponent } from './components/policy-search-results/policy-search-results.component';
import { SubmissionActivityModule } from 'src/app/shared/components/submission-activity/submission-activity.module';
import { PacerSearchResultsComponent } from './components/pacer-search-results/pacer-search-results.component';
import { ScrollToTopModule } from 'src/app/core/components/scroll-to-top/scroll-to-top.module';

@NgModule({
  declarations: [
    HomeComponent,
    DirectPolicyComponent,
    ActionComponent,
    InsuredSearchResultsComponent,
    PolicySearchResultsComponent,
    PacerSearchResultsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgSelectModule,
    NgbModule,
    SearchModule,
    DirectivesModule,
    NgxMaskModule.forRoot(),
    BusyModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    PipesModule,
    SubmissionActivityModule,
    ScrollToTopModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
  ]
})
export class HomeModule { }
