import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) {}

  getCartItems(userId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/cart/${userId}`);
  }

  removeFromCart(itemId: string) {
    return this.http.delete(`${this.baseUrl}/cart/remove/${itemId}`);
  }

  /** Register user for a webinar */
  registerForWebinar(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Get token from local storage
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/webinar-subscriptions/subscribe`, payload, { headers });
  }
}