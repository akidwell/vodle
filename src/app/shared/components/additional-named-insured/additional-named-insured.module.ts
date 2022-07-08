import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedAdditionalNamedInsuredsComponent } from './additional-named-insureds/additional-named-insureds.component';
import { SharedAdditionalNamedInsuredsGroupComponent } from './additional-named-insureds-group/additional-named-insureds-group.component';
import { DirectivesModule } from '../../directives/directives.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [SharedAdditionalNamedInsuredsGroupComponent,
    SharedAdditionalNamedInsuredsComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    DragDropModule,
    MatSlideToggleModule
  ],
  exports: [SharedAdditionalNamedInsuredsGroupComponent]
})
export class AdditionalNamedInsuredModule { }
