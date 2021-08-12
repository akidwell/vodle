import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    SearchBarComponent, 
  ],
  imports: [
    CommonModule,
    HomeRoutingModule, 
    FormsModule
  ]
})
export class HomeModule { }
