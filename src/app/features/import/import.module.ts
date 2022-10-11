import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportRoutingModule } from './import-routing.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ImportComponent } from './components/import/import.component';
import { RemoveCommaPipe } from 'src/app/shared/pipes/remove-comma.pipe';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { ScrollToTopModule } from 'src/app/core/components/scroll-to-top/scroll-to-top.module';

@NgModule({
  declarations: [
    ImportComponent,
    RemoveCommaPipe
  ],
  imports: [
    CommonModule,
    ImportRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    ReactiveFormsModule,
    BusyModule,
    DirectivesModule,
    ScrollToTopModule
  ],
  providers: [DecimalPipe]
})
export class ImportModule { }
