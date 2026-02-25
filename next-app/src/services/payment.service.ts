import { environment } from "./auth.service";

export interface PaymentInfo {
    qrCodeUrl: string;
    transactionId: string;
    amount: number;
    webinarId: string;
    type: string;
}

export class PaymentService {
    /**
     * Generate payment information including QR code and transaction ID
     */
    static async generatePaymentInfo(
        type: string,
        webinarId: string,
        amount: number = 0
    ): Promise<PaymentInfo> {
        const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const qrData = {
            transactionId: transactionId,
            webinarId: webinarId,
            type: type,
            amount: amount,
            timestamp: new Date().toISOString(),
        };

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            JSON.stringify(qrData)
        )}`;

        return {
            qrCodeUrl,
            transactionId,
            amount,
            webinarId,
            type,
        };
    }

    /**
     * Verify payment status
     */
    static async verifyPayment(transactionId: string): Promise<any> {
        const response = await fetch(
            `${environment.api}/payments/verify/${transactionId}`
        );
        if (!response.ok) {
            throw await response.json();
        }
        return response.json();
    }

    /**
     * Get webinar details for payment
     */
    static async getWebinarDetails(webinarId: string): Promise<any> {
        const response = await fetch(
            `${environment.api}/webinars/get-webinar-public/${webinarId}`
        );
        if (!response.ok) {
            throw await response.json();
        }
        return response.json();
    }

    /**
     * Initiate payment with payment gateway
     */
    static async initiatePayment(paymentRequest: any): Promise<any> {
        const response = await fetch(`${environment.api}/payment/initiate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentRequest),
        });
        if (!response.ok) {
            throw await response.json();
        }
        return response.json();
    }
}
