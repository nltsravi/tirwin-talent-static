import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminUserComponent } from './admin-user.component';
import { TrainerDetailsComponent } from './trainer-details.component';

@NgModule({
  declarations: [AdminUserComponent, TrainerDetailsComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [AdminUserComponent, TrainerDetailsComponent]
})
export class AdminUserModule {} 