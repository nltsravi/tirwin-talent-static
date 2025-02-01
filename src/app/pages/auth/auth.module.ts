import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { TraineeRegisterComponent } from './trainee-register/trainee-register.component';
import { OTPComponent } from './otp-validation/otp-validation.component';


const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'register', component: TraineeRegisterComponent },
  { path: 'validate', component: OTPComponent }
];

@NgModule({
  declarations: [AuthComponent,TraineeRegisterComponent,OTPComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule],
  providers: [AuthService]  // ✅ Export RouterModule
})
export class AuthModule { }