import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderModule } from './components/header/header.module';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { SliderComponent } from './components/slider/slider.component';
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

@NgModule({
    declarations: [
        AppComponent,
        DefaultLayoutComponent,
        SliderComponent,
    ],
    bootstrap: [AppComponent], 
    imports: [
        RouterModule.forRoot([]),
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HeaderModule,
        FooterModule,
        HomeModule,
        AuthModule,
        ProfileModule,
        WebinarListModule,
        CourseDetailsModule,
        CheckoutModule,
        MyCoursesModule,
        AdminUserModule
    ], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
