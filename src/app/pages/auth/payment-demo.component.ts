import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-demo',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">Payment Registration Demo</h4>
            </div>
            <div class="card-body">
              <p class="mb-4">This demo shows how the registration flow works with payment parameters.</p>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="card border-success">
                    <div class="card-header bg-success text-white">
                      <h5 class="mb-0">Trainee Registration with Payment</h5>
                    </div>
                    <div class="card-body">
                      <p>Register as a trainee with payment for a webinar:</p>
                      <button class="btn btn-success" (click)="navigateToTraineePayment()">
                        Try Trainee Registration with Payment
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="card border-info">
                    <div class="card-header bg-info text-white">
                      <h5 class="mb-0">Trainer Registration with Payment</h5>
                    </div>
                    <div class="card-body">
                      <p>Register as a trainer with payment for a webinar:</p>
                      <button class="btn btn-info" (click)="navigateToTrainerPayment()">
                        Try Trainer Registration with Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4">
                <h5>URL Structure:</h5>
                <div class="alert alert-light">
                  <code>/auth/register/{{ '{' }}type{{ '}' }}/{{ '{' }}webinar-id{{ '}' }}</code> - For trainee registration<br>
                  <code>/auth/trainer-registration/{{ '{' }}type{{ '}' }}/{{ '{' }}webinar-id{{ '}' }}</code> - For trainer registration
                </div>
                
                <h5>Example URLs:</h5>
                <ul>
                  <li><code>/auth/register/premium/12345</code></li>
                  <li><code>/auth/register/basic/67890</code></li>
                  <li><code>/auth/trainer-registration/premium/12345</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 1rem;
    }
    code {
      background: #f8f9fa;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
    }
  `]
})
export class PaymentDemoComponent {
  constructor(private router: Router) {}

  navigateToTraineePayment() {
    this.router.navigate(['/auth/register', 'premium', 'demo-webinar-123']);
  }

  navigateToTrainerPayment() {
    this.router.navigate(['/auth/trainer-registration', 'premium', 'demo-webinar-123']);
  }
} 