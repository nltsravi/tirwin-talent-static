import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    // canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
