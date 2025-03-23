import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DualNBackComponent } from './dual-n-back/dual-n-back.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "DualNBack"},
  { path: "DualNBack", component: DualNBackComponent,},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
