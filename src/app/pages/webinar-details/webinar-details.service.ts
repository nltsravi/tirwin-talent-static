import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class WebinarService {
  /* private apiUrl = "https://dev.api.tirwintalent.com/api/webinars";
  private publicApiUrl = "https://dev.api.tirwintalent.com/api/webinars";
  private subscribeUrl =
    "https://dev.api.tirwintalent.com/api/webinar-subscriptions/subscribe";
  private baseUrl = "https://dev.api.tirwintalent.com/api";*/

  private apiUrl = "http://localhost:3000/api/webinars";
  private publicApiUrl = "http://localhost:3000/api/webinars";
  private subscribeUrl =
    "http://localhost:3000/api/webinar-subscriptions/subscribe";
  private baseUrl = "http://localhost:3000/api";

  constructor(private http: HttpClient) {}

  getWebinarById(id: string): Observable<any> {
    const token = localStorage.getItem("authToken");

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set("Authorization", `Bearer ${token}`);
      return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
    } else {
      return this.http.get<any>(
        `${this.publicApiUrl}/get-webinar-public/${id}`
      );
    }
  }

  registerForWebinar(webinarId: string, amount: any): Observable<any> {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || !user.id) {
      return new Observable((observer) => observer.error("User not logged in"));
    }

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
    const payload = {
      webinarId: webinarId,
      userId: user.id,
      transactionId: `TXN${Math.floor(100000 + Math.random() * 900000)}`, // Generate fake transaction ID
      amount: parseFloat(amount),
    };

    return this.http.post<any>(this.subscribeUrl, payload, { headers });
  }

  addToCart(data: { webinarId: string; userId: string }) {
    return this.http.post(`${this.baseUrl}/cart/add`, data);
  }
}