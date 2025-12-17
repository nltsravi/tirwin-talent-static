import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './components/header/header.module';


import { HomeModule } from './pages/home/home.module';
import { AuthModule } from './pages/auth/auth.module';
import { FooterModule } from './components/footer/footer.module';
import { ProfileModule } from './pages/profile/profile.module';
import { WebinarListModule } from './pages/webinar-list/webinar-list.module';
import { CourseDetailsModule } from './pages/webinar-details/webinar-details.module';
import { CheckoutModule } from './pages/checkout/checkout.module';
import { RouterModule } from '@angular/router';
import { MyCoursesModule } from './pages/my-courses/my-courses.module';
import { AdminUserModule } from './pages/admin-user/admin-user.module';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { PricingPolicyComponent } from './pages/pricing-policy/pricing-policy.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LeadershipComponent } from './pages/leadership/leadership.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { DefaultLayoutModule } from './layout/default-layout/default-layout.module';
import { BrandAwarenessComponent } from './pages/brand-awareness/brand-awareness.component';
import { RegMinComponent } from './pages/reg-min/reg-min.component';
import { RegInfoComponent } from './pages/reg-info/reg-info.component';

@NgModule({
    declarations: [
        AppComponent,
        TermsConditionsComponent,
        PrivacyPolicyComponent,
        PricingPolicyComponent,
        AboutUsComponent,
        LeadershipComponent,
        ContactUsComponent,
        ContactUsComponent,
        BrandAwarenessComponent,
        RegMinComponent,
        RegInfoComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        RouterModule.forRoot([]),
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        HeaderModule,
        FooterModule,
        DefaultLayoutModule,
        HomeModule,
        AuthModule,
        ProfileModule,
        WebinarListModule,
        CourseDetailsModule,
        CheckoutModule,
        MyCoursesModule,
        AdminUserModule,
        ToastrModule.forRoot()
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
