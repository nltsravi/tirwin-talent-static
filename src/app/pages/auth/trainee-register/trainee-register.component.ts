import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TraineeRegisterService } from './trainee-register.service';

@Component({
  selector: 'app-trainee-register',
  templateUrl: './trainee-register.component.html',
  styleUrls: ['./trainee-register.component.css']
})
export class TraineeRegisterComponent implements OnInit, OnDestroy {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  jobTitle: string = '';
  phone: string = '';
  company: string = '';
  subscriptionId: string = '06fff7d5-00b6-4679-afd8-d3dd4ae3beda';

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  images: string[] = [
    'https://i.ytimg.com/vi/0kfPCjk4sdg/maxresdefault.jpg',
    'https://i.fbcd.co/products/original/business-webinar-banner-template-021-8265ba94e05234c977a44e21e96c0622d09a2e318183b9f572df8016f51440e7.jpg',
  ];
  currentImage: string = this.images[0];
  private intervalId: any;

  constructor(private registerService: TraineeRegisterService, private router: Router) {}

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

  registerTrainee() {
    if (!this.firstName || !this.lastName || !this.email || !this.jobTitle || !this.phone || !this.company) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const userData = {
      email: this.email,
      phone: this.phone,
      first_name: this.firstName,
      last_name: this.lastName,
      organization: this.company,
      job_title: this.jobTitle,
      user_type: 'trainee',
      is_first_time_login: true,
      subscriptionId: this.subscriptionId
    };

    this.registerService.registerUser(userData).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        
        // ✅ After registration, trigger OTP
        this.registerService.sendOtp(this.email).subscribe({
          next: () => {
            // ✅ Redirect to OTP validation page
            this.router.navigate(['/auth/validate'], { state: { email: this.email } }); // Pass email to OTP page
          },
          error: (otpError) => {
            console.error('Error sending OTP:', otpError);
            this.errorMessage = 'Registration successful, but failed to send OTP.';
          }
        });

        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error registering trainee:', error);
        this.errorMessage = error.error.message || 'Failed to register. Please try again later.';
        this.isSubmitting = false;
      }
    });
  }
}