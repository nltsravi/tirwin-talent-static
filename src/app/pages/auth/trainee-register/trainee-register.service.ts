import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TraineeRegisterService {
  private userApiUrl = 'http://localhost:3000/users'; // User Registration API
  private otpApiUrl = 'http://localhost:3000/auth/login'; // OTP Trigger API
  private validateOtpApiUrl = 'http://localhost:3000/auth/validate-otp'; // OTP Validation API

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(this.userApiUrl, userData);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post<any>(this.otpApiUrl, { email });
  }

  validateOtp(email: string, otpCode: string): Observable<any> {
    return this.http.post<any>(this.validateOtpApiUrl, { email, otpCode });
  }
}