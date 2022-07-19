import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from '../../directives/directives.module';
import { PropertyPremiumComponent } from './property-premium.component';

@NgModule({
  declarations: [PropertyPremiumComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    FormsModule,
    DirectivesModule
  ],
  exports: [PropertyPremiumComponent]
})
export class PropertyPremiumModule { }
