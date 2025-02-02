import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrainerProfileComponent } from './trainer/trainer-profile.component';

const routes: Routes = [
  { path: 'trainer', component: TrainerProfileComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [TrainerProfileComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes)],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule]  // ✅ Export RouterModule
})
export class ProfileModule { }