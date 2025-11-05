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
    const txnId = queryParams['txnId'];

    console.log('Loading payment confirmation for:', {
      webinarId,
      webinarType,
      txnId
    });

    // Auto-redirect after 5 seconds
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

  ngOnDestroy(): void {
    // Clean up timer when component is destroyed
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }
}

