import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralRemarksComponent } from './general-remarks/general-remarks.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollToTopModule } from 'src/app/core/components/scroll-to-top/scroll-to-top.module';
import { CanDeactivateGuard } from 'src/app/features/policy/guards/can-deactivate-guard';
import { DirectivesModule } from '../../directives/directives.module';
import { GeneralRemarksGroupComponent } from './general-remarks-group/general-remarks-group.component';



@NgModule({
  declarations: [
    GeneralRemarksComponent,
    GeneralRemarksGroupComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    ScrollToTopModule
  ],
  providers: [
    CanDeactivateGuard
  ],
  exports: [GeneralRemarksGroupComponent]
})
export class GeneralRemarksModule { }
