import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  errorMessage = '';
  userId: any = '';
  isProcessing = false;
  successMessage = '';

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.userId = JSON.parse(sessionStorage.getItem('user') ?? '{}'); // Use '{}' if null

    if (this.userId) {
      this.getCartItems();
    } else {
      this.errorMessage = 'User not logged in.';
    }
  }

  getCartItems() {
    this.cartService.getCartItems(this.userId?.id).subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: () => {
        this.errorMessage = 'Failed to load cart items.';
      }
    });
  }

  removeFromCart(itemId: string) {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      },
      error: () => {
        this.errorMessage = 'Failed to remove item.';
      }
    });
  }

  /** Proceed to purchase all items in the cart */
  /** Proceed to purchase all items in the cart */
  proceedToPurchase() {
    if (!this.cartItems.length) {
      this.errorMessage = 'Cart is empty.';
      return;
    }

    this.isProcessing = true;
    this.successMessage = '';
    this.errorMessage = '';

    const transactions = this.cartItems.map(item => ({
      webinarId: item.webinar.id,
      userId: this.userId?.id,
      transactionId: `TXN${Date.now()}`,
      amount: parseFloat(item.amount)
    }));

    let successfulRegistrations = 0;
    let totalTransactions = transactions.length;

    transactions.forEach((transaction, index) => {
      this.cartService.registerForWebinar(transaction).subscribe({
        next: (response) => {
          successfulRegistrations++;

          // Remove item from the cart after successful registration
          this.cartService.removeFromCart(this.cartItems[index].id).subscribe();

          // Check if all transactions are successful before showing success message
          if (successfulRegistrations === totalTransactions) {
            this.successMessage = '✅ Successfully registered for all webinars!';
            this.isProcessing = false;

            // Redirect after showing success message
            setTimeout(() => {
              this.router.navigate(['/webinar']);
            }, 2000);
          }
        },
        error: (error) => {
          console.error('Error during purchase:', error);
          this.errorMessage = '❌ Failed to complete some registrations. Please try again.';
          this.isProcessing = false;
        }
      });
    });
  }
}