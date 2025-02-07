import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebinarDetailsComponent } from './webinar-details.component';

const routes: Routes = [
  { path: '', component: WebinarDetailsComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [WebinarDetailsComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule]  // ✅ Export RouterModule
})
export class CourseDetailsModule { }