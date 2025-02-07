import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
  styleUrls: ['./otp-validation.component.css']
})
export class OTPComponent implements OnInit, OnDestroy {
  otpCode: string = '';
  email: string = '';
  alertMessage: string | null = null;
  alertClass: string = '';

  images: string[] = [
    'https://i.ytimg.com/vi/0kfPCjk4sdg/maxresdefault.jpg',
    'https://i.fbcd.co/products/original/business-webinar-banner-template-021-8265ba94e05234c977a44e21e96c0622d09a2e318183b9f572df8016f51440e7.jpg',
  ];
  currentImage: string = this.images[0];
  private intervalId: any;

  constructor(private router: Router, private authService: AuthService) {
    // Retrieve email from router state
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras.state?.['email'] || ''; 
    if(this.email === '') {
      this.router.navigate(['auth/login'])
    }
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  nextImage() {
    const currentIndex = this.images.indexOf(this.currentImage);
    const nextIndex = (currentIndex + 1) % this.images.length;
    this.currentImage = this.images[nextIndex];
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  validateOtp() {
    if (!this.otpCode) {
      this.showAlert('Please enter the OTP', 'alert-danger');
      return;
    }
  
    this.authService.validateOtp(this.email, this.otpCode.toString()).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
  
        // Fetch profile data
        this.authService.getProfile().subscribe({
          next: (userData) => {
            localStorage.setItem('user', JSON.stringify(userData));
            this.authService.setAuthState(true); // Update auth state
            this.showAlert('Login successful', 'alert-success');
  
            setTimeout(() => {
              this.router.navigate(['/webinar']).then(() => {
                window.location.reload(); // **Force page reload**
              });
            }, 2000);
          },
          error: (error) => {
            console.error('Profile fetch error:', error);
            this.showAlert('Failed to fetch user profile.', 'alert-danger');
          }
        });
      },
      error: (error) => {
        console.error('OTP validation failed:', error);
        this.showAlert('Invalid OTP. Please try again.', 'alert-danger');
      }
    });
  }

  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertClass = type;
    setTimeout(() => this.clearAlert(), 5000);
  }

  clearAlert() {
    this.alertMessage = null;
    this.alertClass = '';
  }
}