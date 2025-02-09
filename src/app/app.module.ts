import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderModule } from './components/header/header.module';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { SliderComponent } from './components/slider/slider.component';
import { HomeModule } from './pages/home/home.module';
import { AuthModule } from './pages/auth/auth.module';
import { FooterModule } from './components/footer/footer.module';
import { TrainerProfileComponent } from './pages/profile/trainer/trainer-profile.component';
import { ProfileModule } from './pages/profile/profile.module';
import { WebinarListComponent } from './pages/webinar-list/webinar-list.component';
import { WebinarListModule } from './pages/webinar-list/webinar-list.module';
import { CourseDetailsModule } from './pages/webinar-details/webinar-details.module';
import { CheckoutModule } from './pages/checkout/checkout.module';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HeaderModule,
    FooterModule,
    HomeModule,
    AuthModule,
    ProfileModule,
    WebinarListModule,
    CourseDetailsModule,
    CheckoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
