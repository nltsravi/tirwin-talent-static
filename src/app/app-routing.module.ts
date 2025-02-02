import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent, // Default layout for the main pages
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect root to home
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), data: { showSlider: true }  }, // Lazy-loaded HomeModule
      { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule), data: { showSlider: false }  }, // 
      { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), data: { showSlider: false }  }, // 
      { path: 'webinar', loadChildren: () => import('./pages/webinar-list/webinar-list.module').then(m => m.WebinarListModule), data: { showSlider: true }  }, // 
    ]
  },
  { path: '**', redirectTo: 'home' } // Catch-all route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }