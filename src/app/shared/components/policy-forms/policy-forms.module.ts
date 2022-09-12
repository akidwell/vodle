import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from '../../directives/directives.module';
import { CanDeactivateGuard } from 'src/app/features/policy/guards/can-deactivate-guard';
import { PolicyFormsComponent } from './policy-forms.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpecimenPacketService } from './services/specimen-packet.service';
import { PolicyFormVariableComponent } from './policy-form-variable/policy-form-variable.component';
import { ScrollToTopModule } from 'src/app/core/components/scroll-to-top/scroll-to-top.module';

@NgModule({
  declarations: [
    PolicyFormsComponent,
    PolicyFormVariableComponent
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
    CanDeactivateGuard,
    SpecimenPacketService
  ],
  exports: [PolicyFormsComponent]
})
export class PolicyFormsModule { }
