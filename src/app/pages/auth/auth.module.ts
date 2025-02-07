import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { TraineeRegisterComponent } from './trainee-register/trainee-register.component';
import { OTPComponent } from './otp-validation/otp-validation.component';
import { TrainerRegisterComponent } from './trainer-registration/trainer-register.component';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'register', component: TraineeRegisterComponent },
  { path: 'validate', component: OTPComponent },
  { path: 'trainer-registration', component: TrainerRegisterComponent }
];

@NgModule({
  declarations: [AuthComponent,TraineeRegisterComponent,OTPComponent,TrainerRegisterComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule,HttpClientModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule],
  providers: [AuthService]  // ✅ Export RouterModule
})
export class AuthModule { }