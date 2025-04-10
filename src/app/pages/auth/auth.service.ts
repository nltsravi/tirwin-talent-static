import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.api}/auth/login`;
  private otpValidationUrl = `${environment.api}/auth/validate-otp`;
  private profileUrl = `${environment.api}/profile/me`;

  private authState = new BehaviorSubject<boolean>(this.isUserLoggedIn());

  constructor(private http: HttpClient) {}

  // Check if user is logged in
  isUserLoggedIn(): boolean {
    return !!sessionStorage.getItem("authToken");
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
    const token = sessionStorage.getItem("authToken");
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
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    this.setAuthState(false);
  }
}