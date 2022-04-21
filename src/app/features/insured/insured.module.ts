import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuredRoutingModule } from './insured-routing.module';
import { AdditionalNamedInsuredModule } from '../../shared/components/additional-named-insured/additional-named-insured.module';
import { InsuredComponent } from './components/insured-base/insured.component';
import { InsuredAccountComponent } from 'src/app/features/insured/components/insured-account/insured-account.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [
    InsuredComponent,
    InsuredAccountComponent],
  imports: [
    CommonModule,
    InsuredRoutingModule,
    AdditionalNamedInsuredModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    NgxMaskModule.forRoot()
  ]
})
export class InsuredModule { }