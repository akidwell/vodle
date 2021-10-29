import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchResultsComponent } from './search-results/search-results.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    HomeComponent,
    SearchBarComponent, 
    SearchResultsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule, 
    FormsModule,
    FontAwesomeModule,
    NgSelectModule,
    NgbModule
  ]
})
export class HomeModule { }
