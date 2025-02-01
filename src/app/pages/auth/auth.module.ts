import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  { path: 'login', component: AuthComponent }  // ✅ Correct path setup
];

@NgModule({
  declarations: [AuthComponent],  // ✅ Ensure this is declared
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule],  // ✅ Use RouterModule.forChild()
  exports: [RouterModule],
  providers: [AuthService]  // ✅ Export RouterModule
})
export class AuthModule { }