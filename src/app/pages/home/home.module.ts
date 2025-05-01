import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [HomeComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes)],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule]  // ✅ Export RouterModule
})
export class HomeModule { }