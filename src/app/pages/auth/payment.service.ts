import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentInfo {
  qrCodeUrl: string;
  transactionId: string;
  amount: number;
  webinarId: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) {}

  /**
   * Generate payment information including QR code and transaction ID
   */
  generatePaymentInfo(type: string, webinarId: string, amount: number = 0): Observable<PaymentInfo> {
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Generate QR code data (you can customize this based on your payment gateway)
    const qrData = {
      transactionId: transactionId,
      webinarId: webinarId,
      type: type,
      amount: amount,
      timestamp: new Date().toISOString()
    };

    // For demo purposes, we'll create a simple QR code URL
    // In production, you might want to use a QR code generation service
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;

    const paymentInfo: PaymentInfo = {
      qrCodeUrl: qrCodeUrl,
      transactionId: transactionId,
      amount: amount,
      webinarId: webinarId,
      type: type
    };

    return of(paymentInfo);
  }

  /**
   * Verify payment status
   */
  verifyPayment(transactionId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/payments/verify/${transactionId}`);
  }

  /**
   * Get webinar details for payment
   */
  getWebinarDetails(webinarId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/webinars/get-webinar-public/${webinarId}`);
  }

  /**
   * Initiate payment with payment gateway
   */
  initiatePayment(paymentRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/payment/initiate`, paymentRequest);
  }
} 