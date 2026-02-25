import { environment } from "./auth.service";

export class CartService {
  private static getHeaders() {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("authToken") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async getCartItems(userId: string): Promise<any[]> {
    const url = `${environment.api}/cart/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    return response.json();
  }

  static async removeFromCart(itemId: string): Promise<void> {
    const url = `${environment.api}/cart/remove/${itemId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to remove item from cart");
    }
  }

  static async registerForWebinar(payload: {
    webinarId: string;
    userId: string;
    transactionId: string;
    amount: number;
  }): Promise<any> {
    const url = `${environment.api}/webinar-subscriptions/subscribe`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to register for webinar");
    }
    return response.json();
  }
}
