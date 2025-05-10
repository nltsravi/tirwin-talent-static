import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { AdminUserComponent } from './pages/admin-user/admin-user.component';
import { TrainerDetailsComponent } from './pages/admin-user/trainer-details.component';
import { BecomeInstructorLandingComponent } from './pages/become-instructor/become-instructor-landing.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent, // Default layout for the main pages
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect root to home
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), data: { showSlider: true }  }, // Lazy-loaded HomeModule
      { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule), data: { showSlider: false }  }, // 
      { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), data: { showSlider: false }  }, // 
      { path: 'webinar/:stype', loadChildren: () => import('./pages/webinar-list/webinar-list.module').then(m => m.WebinarListModule), data: { showSlider: false, account: true }  }, // 
      { path: 'webinar/:style/:id', loadChildren: () => import('./pages/webinar-details/webinar-details.module').then(m => m.CourseDetailsModule), data: { showSlider: false, account: true }  }, // 
      { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule), data: { showSlider: false, account: true }  }, // 
      { path: 'myregistration', loadChildren: () => import('./pages/my-courses/my-courses.module').then(m => m.MyCoursesModule), data: { showSlider: false, account: true }  }, // 
      { path: 'admin/user', component: AdminUserComponent, data: { showSlider: false } },
      { path: 'admin/user/trainer/:id', component: TrainerDetailsComponent, data: { showSlider: false } },
      { path: 'become-instructor', component: BecomeInstructorLandingComponent, data: { showSlider: false } },
    ]
  },
  { path: '**', redirectTo: 'home' } // Catch-all route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }