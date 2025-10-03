import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebinarNewDetailsComponent } from './webinar-new-details.component';

const routes: Routes = [
  { path: '', component: WebinarNewDetailsComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [WebinarNewDetailsComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule]  // ✅ Export RouterModule
})
export class WebinarNewDetailsModule { }
