import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WebinarListComponent } from './webinar-list.component';
import { FormsModule } from '@angular/forms';
import { WebinarService } from './webinar-list.service';

const routes: Routes = [
  { path: '', component: WebinarListComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [WebinarListComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule],  // ✅ Export RouterModule
  providers: [WebinarService]
})
export class WebinarListModule { }