import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchResultsComponent } from './search-results/search-results.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchModule } from '../search-bar/search-bar.module';
import { QuoteCreateComponent } from './quote/quote-create/quote-create.component';
import { NgxMaskModule } from 'ngx-mask';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  declarations: [
    HomeComponent,
    SearchResultsComponent,
    QuoteCreateComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule, 
    FormsModule,
    FontAwesomeModule,
    NgSelectModule,
    NgbModule,
    SearchModule,
    DirectivesModule,
    NgxMaskModule.forRoot()
  ]
})
export class HomeModule { }
