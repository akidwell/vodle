import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuredComponent } from './components/insured.component';

const routes: Routes = [
  { path: '', component: InsuredComponent },
  {
  path: ':id',
  component: InsuredComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuredRoutingModule { }
