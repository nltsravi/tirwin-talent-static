import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000';
  private subscribeUrl = 'http://localhost:3000/webinar-subscriptions/subscribe';

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

    return this.http.post(this.subscribeUrl, payload, { headers });
  }
}