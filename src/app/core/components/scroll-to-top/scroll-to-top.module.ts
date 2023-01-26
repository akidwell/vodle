import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { ScrollToTopComponent } from './scroll-to-top.component';


@NgModule({
  declarations: [ ScrollToTopComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatButtonModule,
    DirectivesModule
  ],
  exports: [ScrollToTopComponent]

})
export class ScrollToTopModule { }