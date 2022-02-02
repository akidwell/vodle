import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchResultsComponent } from './search-results/search-results.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchModule } from '../search-bar/search-bar.module';
import { DirectPolicyCreateComponent } from './direct-policy/direct-policy-create/direct-policy-create.component';
import { DirectivesModule } from '../directives/directives.module';
import { ActionComponent } from './search-results/action/action.component';
import { NgxMaskModule } from 'ngx-mask';
import { BusyModule } from '../busy/busy.module';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    HomeComponent,
    SearchResultsComponent,
    DirectPolicyCreateComponent,
    ActionComponent
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
    MatFormFieldModule
  ],
  providers: [
    DatePipe
  ]
})
export class HomeModule { }
