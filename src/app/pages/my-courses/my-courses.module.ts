import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MyWebinarListComponent } from './my-courses.component';

const routes: Routes = [
  { path: '', component: MyWebinarListComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [MyWebinarListComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule]  // ✅ Export RouterModule
})
export class MyCoursesModule { }