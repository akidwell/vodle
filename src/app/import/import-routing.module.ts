import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportComponent } from './import.component';
import { AuthGuard } from '../authorization/auth.guard';

const routes: Routes = [{ path: '', component: ImportComponent, canActivate: [ AuthGuard ] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
