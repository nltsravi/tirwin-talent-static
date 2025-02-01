import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },  // ✅ Redirect to /home
      { path: 'home', loadChildren: () => import('../app/pages/home/home.module').then(m => m.HomeModule) } // ✅ Ensure correct module path
    ]
  },
  { path: '**', redirectTo: 'home' }  // ✅ Catch-all redirect
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }