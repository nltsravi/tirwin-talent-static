import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://dev.api.tirwintalent.com/api/auth/login";
  private otpValidationUrl =
    "https://dev.api.tirwintalent.com/api/auth/validate-otp";
  private profileUrl = "https://dev.api.tirwintalent.com/api/profile/me";

  /*private apiUrl = "https://dev.api.tirwintalent.com/api/auth/login";
  private otpValidationUrl = "https://dev.api.tirwintalent.com/api/auth/validate-otp";
  private profileUrl = "https://dev.api.tirwintalent.com/api/profile/me";*/

  private authState = new BehaviorSubject<boolean>(this.isUserLoggedIn());

  constructor(private http: HttpClient) {}

  // Check if user is logged in
  isUserLoggedIn(): boolean {
    return !!localStorage.getItem("authToken");
  }

  // Expose auth state as an observable
  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  sendOtp(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, { email });
  }

  validateOtp(
    email: string,
    otpCode: string
  ): Observable<{ message: string; token: string }> {
    return this.http.post<{ message: string; token: string }>(
      this.otpValidationUrl,
      { email, otpCode }
    );
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem("authToken");
    if (!token)
      return new Observable((observer) => observer.error("No token found"));

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    return this.http.get<any>(this.profileUrl, { headers });
  }

  // Set user authentication state
  setAuthState(isAuthenticated: boolean) {
    this.authState.next(isAuthenticated);
  }

  // Logout
  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    this.setAuthState(false);
  }
}