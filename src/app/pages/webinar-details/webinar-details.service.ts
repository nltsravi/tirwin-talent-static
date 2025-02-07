import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebinarService {
  private apiUrl = 'http://localhost:3000/webinars';

  constructor(private http: HttpClient) {}

  getWebinarById(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return new Observable(observer => observer.error('No token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }
}