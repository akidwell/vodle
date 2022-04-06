import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/authorization/auth.guard';
import { ImportComponent } from './components/import/import.component';

const routes: Routes = [{ path: '', component: ImportComponent, canActivate: [ AuthGuard ] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
