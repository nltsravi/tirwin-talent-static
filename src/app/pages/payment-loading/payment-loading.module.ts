import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentLoadingComponent } from './payment-loading.component';

const routes: Routes = [
  { path: '', component: PaymentLoadingComponent }
];

@NgModule({
  declarations: [
    PaymentLoadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PaymentLoadingModule { }

