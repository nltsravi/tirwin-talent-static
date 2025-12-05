import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { AdminUserComponent } from './pages/admin-user/admin-user.component';
import { TrainerDetailsComponent } from './pages/admin-user/trainer-details.component';
import { BecomeInstructorLandingComponent } from './pages/become-instructor/become-instructor-landing.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminWebinarComponent } from './pages/admin-webinar/admin-webinar.component';
import { TrainerDetailsPublicComponent } from './pages/admin-user/trainer-details.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { PricingPolicyComponent } from './pages/pricing-policy/pricing-policy.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LeadershipComponent } from './pages/leadership/leadership.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { BrandAwarenessComponent } from './pages/brand-awareness/brand-awareness.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent, // Default layout for the main pages
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect root to home
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), data: { showSlider: true } }, // Lazy-loaded HomeModule
      { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule), data: { showSlider: false } }, // 
      { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), data: { showSlider: false } }, // 
      { path: 'webinar/:stype', loadChildren: () => import('./pages/webinar-list/webinar-list.module').then(m => m.WebinarListModule), data: { showSlider: false, account: true } }, // 
      { path: 'webinar/:style/4e86e649-bb3c-45c4-a2ff-be4c625e2ac8', redirectTo: 'webinar-new/:style/4e86e649-bb3c-45c4-a2ff-be4c625e2ac8' }, // Redirect specific webinar to static page
      { path: 'webinar/:style/:id', loadChildren: () => import('./pages/webinar-details/webinar-details.module').then(m => m.CourseDetailsModule), data: { showSlider: false, account: true } }, // 
      { path: 'webinar-new/:style/:id', loadChildren: () => import('./pages/webinar-new-details/webinar-new-details.module').then(m => m.WebinarNewDetailsModule), data: { showSlider: false, account: true } }, // New webinar details
      { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule), data: { showSlider: false, account: true } }, // 
      { path: 'brand-awareness', component: BrandAwarenessComponent, data: { showSlider: false } },
      { path: 'myregistration', loadChildren: () => import('./pages/my-courses/my-courses.module').then(m => m.MyCoursesModule), data: { showSlider: false, account: true } }, // 
      { path: 'admin/user', component: AdminUserComponent, data: { showSlider: false }, canActivate: [AdminGuard] },
      { path: 'admin/user/trainer/:id', component: TrainerDetailsComponent, data: { showSlider: false }, canActivate: [AdminGuard] },
      { path: 'become-instructor', component: BecomeInstructorLandingComponent, data: { showSlider: false } },
      { path: 'terms-conditions', component: TermsConditionsComponent, data: { showSlider: false } },
      { path: 'privacy-policy', component: PrivacyPolicyComponent, data: { showSlider: false } },
      { path: 'pricing-policy', component: PricingPolicyComponent, data: { showSlider: false } },
      { path: 'about-us', component: AboutUsComponent, data: { showSlider: false } },
      { path: 'leadership', component: LeadershipComponent, data: { showSlider: false } },
      { path: 'contact-us', component: ContactUsComponent, data: { showSlider: false } },
      {
        path: 'admin/webinar-management', component: AdminWebinarComponent, data: { showSlider: false }, canActivate: [AdminGuard],
        children: [
          { path: 'create', component: AdminWebinarComponent }
        ]
      },
      { path: 'trainer/details/:id', component: TrainerDetailsPublicComponent, data: { showSlider: false } },
    ]
  },
  { path: 'payment/loading', loadChildren: () => import('./pages/payment-loading/payment-loading.module').then(m => m.PaymentLoadingModule) }, // Payment loading page
  { path: '**', redirectTo: 'home' } // Catch-all route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }