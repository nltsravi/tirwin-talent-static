import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.api}/auth/login`;
  private otpValidationUrl = `${environment.api}/auth/validate-otp`;
  private profileUrl = `${environment.api}/profile/me`;
  private registerUserUrl = `${environment.api}/users`;
  private registerUrl = `${environment.api}/auth/register`;

  private authState = new BehaviorSubject<boolean>(this.isUserLoggedIn());

  constructor(private http: HttpClient) { }

  // Check if user is logged in
  isUserLoggedIn(): boolean {
    return !!sessionStorage.getItem("authToken");
  }

  // Expose auth state as an observable
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  sendOtp(email: string): Observable<{ message: string }> {
    console.log('Simulated sendOtp:', email);
    return of({ message: 'OTP sent' });
  }

  verifyEmail(userData: any): Observable<{ message: string }> {
    console.log('Simulated verifyEmail:', userData);
    return of({ message: 'Email verified' });
  }

  verifyUserEmail(userData: any): Observable<{ message: string }> {
    console.log('Simulated verifyUserEmail:', userData);
    return of({ message: 'Email verified' });
  }

  validateUsersOtp(
    email: string,
    otpCode: string
  ): Observable<{ message: string; token: string }> {
    console.log('Simulated validateUsersOtp:', email, otpCode);
    return of({ message: 'OTP validated', token: 'mock-jwt-token' });
  }
  validateOtp(
    email: string,
    otpCode: string
  ): Observable<{ message: string; token: string }> {
    console.log('Simulated validateOtp:', email, otpCode);
    return of({ message: 'OTP validated', token: 'mock-jwt-token' });
  }

  validateTrainerOtp(
    email: string,
    otpCode: string
  ): Observable<{ message: string }> {
    console.log('Simulated validateTrainerOtp:', email, otpCode);
    return of({ message: 'OTP validated' });
  }

  registerTrainee(registrationData: any): Observable<any> {
    console.log('Simulated registerTrainee:', registrationData);
    return of({ status: 'success' });
  }

  registerWebinarWithUser(registrationData: any): Observable<any> {
    console.log('Simulated registerWebinarWithUser:', registrationData);
    return of({ status: 'success' });
  }

  checkIfUserExists(email: string): Observable<any> {
    console.log('Simulated checkIfUserExists:', email);
    return of({ status: 'success', isExists: false });
  }

  subscribeToWebinar(subscriptionData: any): Observable<any> {
    console.log('Simulated subscribeToWebinar:', subscriptionData);
    return of({ status: 'success' });
  }

  getProfile(): Observable<any> {
    const token = sessionStorage.getItem("authToken");
    if (!token)
      return new Observable((observer) => observer.error("No token found"));

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get<any>('assets/api-data/profile.json', { headers });
  }

  // Set user authentication state
  setAuthState(isAuthenticated: boolean) {
    this.authState.next(isAuthenticated);
  }

  // Logout
  logout() {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    this.setAuthState(false);
  }
}