import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout.component';

const routes: Routes = [
  { path: '', component: CheckoutComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [CheckoutComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule]  // ✅ Export RouterModule
})
export class CheckoutModule { }