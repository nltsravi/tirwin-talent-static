import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000"; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Login API request
  sendOtp(email: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, email);
  }

  validateOtpCode(email: { email: string; otpCode: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/validate-otp`, email);
  }

  registerTrainee(traineeData: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, traineeData);
  }
  registerTrainer(traineeData: {}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, traineeData);
  }
}