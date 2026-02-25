import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) { }

  getCartItems(userId: string) {
    return this.http.get<any[]>(`assets/api-data/cart.json`);
  }

  removeFromCart(itemId: string) {
    console.log('Simulated removeFromCart:', itemId);
    return of({ status: 'success', message: 'Simulated operation' });
  }

  /** Register user for a webinar */
  registerForWebinar(payload: any): Observable<any> {
    const token = sessionStorage.getItem('authToken'); // Get token from local storage
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Simulated Checkout Register:', payload);
    return of({ status: 'success', message: 'Simulated operation' });
  }
}