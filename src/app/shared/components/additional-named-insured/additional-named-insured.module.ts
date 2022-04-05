import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedAdditionalNamedInsuredsComponent } from './additional-named-insureds/additional-named-insureds.component';
import { SharedAdditionalNamedInsuredsGroupComponent } from './additional-named-insureds-group/additional-named-insureds-group.component';



@NgModule({
  declarations: [SharedAdditionalNamedInsuredsGroupComponent,
    SharedAdditionalNamedInsuredsComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule
  ],
  exports: [SharedAdditionalNamedInsuredsGroupComponent]
})
export class AdditionalNamedInsuredModule { }
