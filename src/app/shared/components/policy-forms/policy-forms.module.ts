import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from '../../directives/directives.module';
import { CanDeactivateGuard } from 'src/app/features/policy/guards/can-deactivate-guard';
import { NgSelectModule } from '@ng-select/ng-select';
import { PolicyFormsService } from './services/policy-forms.service';
import { ScrollToTopModule } from 'src/app/core/components/scroll-to-top/scroll-to-top.module';
import { PolicyFormVariableComponent } from './policy-form-variable/policy-form-variable.component';
import { PolicyFormsComponent } from './policy-forms/policy-forms.component';
import { PolicyFormsSearchComponent } from './policy-forms-search/policy-forms-search.component';

@NgModule({
  declarations: [
    PolicyFormsComponent,
    PolicyFormVariableComponent,
    PolicyFormsSearchComponent
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
    PolicyFormsService
  ],
  exports: [PolicyFormsComponent]
})
export class PolicyFormsModule { }
