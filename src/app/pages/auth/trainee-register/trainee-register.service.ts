import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraineeRegisterService {
  private userApiUrl = `${environment.api}/users`; // User Registration API
  private otpApiUrl = `${environment.api}/auth/login`; // OTP Trigger API
  private validateOtpApiUrl = `${environment.api}/auth/validate-otp`; // OTP Validation API

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