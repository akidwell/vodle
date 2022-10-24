import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarrantiesComponent } from './warranties/warranties.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollToTopModule } from 'src/app/core/components/scroll-to-top/scroll-to-top.module';
import { CanDeactivateGuard } from 'src/app/features/policy/guards/can-deactivate-guard';
import { DirectivesModule } from '../../directives/directives.module';



@NgModule({
  declarations: [
    WarrantiesComponent
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
  exports: [WarrantiesComponent]

})
export class WarrantiesModule { }
