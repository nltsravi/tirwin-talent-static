import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000"; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Login API request
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/auth/login`, body);
  }


  sendOtp(email: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, email);
  }

  validateOtpCode(email: { email: string; otpCode: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/validate-otp`, email);
  }
}