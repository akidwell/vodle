import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AdvancedSearchMenuComponent } from './advanced-search-menu/advanced-search-menu.component';

@NgModule({
  declarations: [ SearchBarComponent, AdvancedSearchMenuComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgSelectModule,
    NgbCollapse,
    MatDatepickerModule
  ],
  exports: [SearchBarComponent]

})
export class SearchModule { }
