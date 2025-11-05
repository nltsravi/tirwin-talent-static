import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-loading',
  templateUrl: './payment-loading.component.html',
  styleUrls: ['./payment-loading.component.css']
})
export class PaymentLoadingComponent implements OnInit, OnDestroy {
  private redirectTimer: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    console.log('Payment loading page initialized');
  }

  ngOnInit(): void {
    // Get query parameters (webinar ID, transaction ID, etc.)
    const queryParams = this.route.snapshot.queryParams;
    const webinarId = queryParams['webinarId'];
    const webinarType = queryParams['type'] || 'masterclass';
    const txnId = queryParams['txnId'] || queryParams['transactionId'] || queryParams['transaction_id'];
    const success = queryParams['success'];

    console.log('Loading payment confirmation for:', {
      webinarId,
      webinarType,
      txnId,
      success
    });

    // Check if this is a popup window (has opener)
    if (window.opener && !window.opener.closed) {
      console.log('Detected popup window, sending postMessage to parent');
      
      // Send success message to parent window
      window.opener.postMessage({
        status: 'success',
        transactionId: txnId,
        txnId: txnId,
        webinarId: webinarId,
        webinarType: webinarType,
        url: window.location.href
      }, '*');

      // Close this popup window after a short delay
      setTimeout(() => {
        console.log('Closing popup window');
        window.close();
      }, 1000); // 1 second delay to ensure message is received
    } else {
      // Not a popup, redirect after delay
      this.redirectTimer = setTimeout(() => {
        console.log('Redirecting to registration success page...');
        
        // Redirect to webinar registration page with success state
        if (webinarId && webinarType) {
          // Redirect to specific webinar registration with success
          this.router.navigate(['/auth/register', webinarType, webinarId], {
            queryParams: { 
              success: 'true',
              txnId: txnId 
            }
          });
        } else {
          // Default redirect to home
          this.router.navigate(['/home']);
        }
      }, 5000); // 5 seconds
    }
  }

  ngOnDestroy(): void {
    // Clean up timer when component is destroyed
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }
}

