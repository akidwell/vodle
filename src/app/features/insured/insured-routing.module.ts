import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuredComponent } from './components/insured-base/insured.component';
import { InsuredNotFoundComponent } from './components/insured-not-found/insured-not-found.component';
import { InsuredAdditionalNamedInsuredsResolver, InsuredResolver } from './services/insured-resolver/insured-resolver.service';

const routes: Routes = [
  {
    path: 'insured-not-found',
    component: InsuredNotFoundComponent,
  },
  {
    path: '', component: InsuredComponent,
    resolve: {
      insuredData: InsuredResolver,
      aniData: InsuredAdditionalNamedInsuredsResolver
    },
  },
  {
    path: ':id',
    component: InsuredComponent,
    resolve: {
      insuredData: InsuredResolver,
      aniData: InsuredAdditionalNamedInsuredsResolver
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuredRoutingModule { }
