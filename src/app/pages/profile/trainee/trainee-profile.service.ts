import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TraineeProfileService {
  private profileUrl = 'http://localhost:3000/profile/me'; // Profile API

  constructor(private http: HttpClient) {}

  getProfile(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.profileUrl, { headers });
  }
}