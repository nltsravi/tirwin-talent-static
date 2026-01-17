import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebinarFreeDetailsComponent } from './webinar-free-details.component';

const routes: Routes = [
  { path: '', component: WebinarFreeDetailsComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [WebinarFreeDetailsComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule]  // ✅ Export RouterModule
})
export class WebinarFreeDetailsModule { }
