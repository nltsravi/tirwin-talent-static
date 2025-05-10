import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { TraineeRegisterComponent } from './trainee-register/trainee-register.component';
import { OTPComponent } from './otp-validation/otp-validation.component';
import { TrainerRegisterComponent } from './trainer-registration/trainer-register.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'register', component: TraineeRegisterComponent },
  { path: 'validate', component: OTPComponent },
  { path: 'trainer-registration', component: TrainerRegisterComponent }
];

@NgModule({
  declarations: [
    AuthComponent,
    TraineeRegisterComponent,
    OTPComponent,
    TrainerRegisterComponent
  ],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgSelectModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AuthModule { }