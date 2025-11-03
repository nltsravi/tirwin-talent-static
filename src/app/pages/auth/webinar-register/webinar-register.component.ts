import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { PaymentService } from '../payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-webinar-register',
  templateUrl: './webinar-register.component.html',
  styleUrls: ['./webinar-register.component.css']
})
export class WebinarRegisterComponent implements OnInit {
  // Form fields
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  jobTitle: string = '';
  company: string = '';

  // Form state
  isSubmitting: boolean = false;
  errorMessage: string = '';
  showOtpSection: boolean = false;
  otpCode: string = '';
  isOtpSent: boolean = false;
  isOtpVerifying: boolean = false;
  isEmailVerified: boolean = false;
  isVerifyingEmail: boolean = false;
  isOtpVerified: boolean = false;
  isVerifyingOtp: boolean = false;

  // Field disable states
  isFirstNameDisabled: boolean = false;
  isLastNameDisabled: boolean = false;
  isJobTitleDisabled: boolean = false;
  isCompanyDisabled: boolean = false;
  isPhoneDisabled: boolean = false;

  // User existence tracking
  isExistingUser: boolean = false;
  userId: string = '';

  // Payment flow
  showPaymentSection: boolean = false;
  isLoadingPayment: boolean = false;
  paymentInfo: any = null;
  userTransactionId: string = '';
  webinarDetails: any = null;
  transactionReference: string = '';

  // Thank you page state
  showThankYouPage: boolean = false;

  public logoUrl = 'assets/images/logo.png';

  /**
   * Check if webinar is free
   */
  isFreeWebinar(): boolean {
    const price = parseFloat(this.webinarDetails?.price || '0');
    return price === 0 || price === 0.00;
  }

  /**
   * Get display price for webinar
   */
  getDisplayPrice(): string {
    if (this.isFreeWebinar()) {
      return 'FREE';
    }
    return `₹${this.webinarDetails?.price || 99}`;
  }

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Extract webinar parameters from URL
    this.route.params.subscribe(params => {
      const webinarType = params['webinarType'];
      const webinarId = params['webinarId'];
      
      if (webinarType && webinarId) {
        this.showPaymentSection = true;
        this.loadWebinarDetails(webinarId);
        this.generatePaymentInfo(webinarType, webinarId);
      }
    });
  }

  /**
   * Load webinar details from API
   */
  loadWebinarDetails(webinarId: string): void {
    this.paymentService.getWebinarDetails(webinarId).subscribe({
      next: (response) => {
        this.webinarDetails = response;
        console.log('Webinar details loaded:', this.webinarDetails);
      },
      error: (error) => {
        console.error('Error loading webinar details:', error);
        this.errorMessage = 'Failed to load webinar details. Please try again.';
      }
    });
  }

  /**
   * Generate payment information
   */
  generatePaymentInfo(type: string, webinarId: string): void {
    this.isLoadingPayment = true;
    
    this.paymentService.generatePaymentInfo(type, webinarId).subscribe({
      next: (paymentInfo) => {
        this.paymentInfo = paymentInfo;
        this.isLoadingPayment = false;
        console.log('Payment info generated:', paymentInfo);
      },
      error: (error) => {
        console.error('Error generating payment info:', error);
        this.isLoadingPayment = false;
        this.errorMessage = 'Failed to generate payment information. Please try again.';
      }
    });
  }

  /**
   * Verify email and send OTP (like trainer onboarding)
   */
  verifyUserEmail(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address first.';
      return;
    }

    this.isVerifyingEmail = true;
    this.errorMessage = '';

    // First verify email (like trainer onboarding)
    const userData = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      user_type: 'trainee',
      is_verified: false,
      is_first_time_login: true,
      subscriptionId: '06fff7d5-00b6-4679-afd8-d3dd4ae3beda',
      is_active: true
    };

    this.authService.verifyUserEmail(userData).subscribe({
      next: (response) => {
        this.isEmailVerified = true;
        this.isVerifyingEmail = false;
        this.isOtpSent = true;
        console.log('Email verified successfully:', response);
      },
      error: (error) => {
        this.isVerifyingEmail = false;
        console.error('Email verification error:', error);
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to verify email. Please try again.';
        }
      }
    });
  }

  /**
   * Validate OTP (like trainer onboarding)
   */
  validateOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.isVerifyingOtp = true;
    this.errorMessage = '';

    this.authService.validateTrainerOtp(this.email, this.otpCode).subscribe({
      next: (response: any) => {
        this.isOtpVerified = true;
        this.isVerifyingOtp = false;
        console.log('OTP verified successfully:', response);
      },
      error: (error: any) => {
        this.isVerifyingOtp = false;
        console.error('OTP verification error:', error);
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to verify OTP. Please try again.';
        }
      }
    });
  }
  validateUsersOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.isVerifyingOtp = true;
    this.errorMessage = '';

    this.authService.validateUsersOtp(this.email, this.otpCode).subscribe({
      next: (response: any) => {
        this.isOtpVerified = true;
        this.isVerifyingOtp = false;
        console.log('OTP verified successfully:', response);
        
        // Check if user already exists and populate details
        if (response && response.user) {
          const user = response.user;
          this.isExistingUser = true;
          
          // Store user ID for webinar subscription
          if (user.id) {
            this.userId = user.id;
          }
          
          // Populate first name if available
          if (user.first_name) {
            this.firstName = user.first_name;
            this.isFirstNameDisabled = true;
          }
          
          // Populate last name if available
          if (user.last_name) {
            this.lastName = user.last_name;
            this.isLastNameDisabled = true;
          }
          
          // Populate job title if available
          if (user.job_title) {
            this.jobTitle = user.job_title;
            this.isJobTitleDisabled = true;
          }
          
          // Populate company if available
          if (user.company || user.organization) {
            this.company = user.company || user.organization;
            this.isCompanyDisabled = true;
          }
          
          // Populate phone if available
          if (user.phone) {
            this.phone = user.phone;
            this.isPhoneDisabled = true;
          }
        } else {
          this.isExistingUser = false;
          this.userId = '';
        }
      },
      error: (error: any) => {
        this.isVerifyingOtp = false;
        console.error('OTP verification error:', error);
        
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to verify OTP. Please try again.';
        }
      }
    });
  }
  /**
   * Generate random transaction ID based on date and timestamp
   */
  generateRandomTransactionId(): string {
    const now = new Date();
    const timestamp = now.getTime();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const retTxnId = `FREE_${dateStr}_${timestamp}_${randomSuffix}`;
    
    return `FREE_${dateStr}_${timestamp}_${randomSuffix}`;
  }

  /**
   * Complete registration after OTP verification
   */
  completeRegistration(): void {
    this.isSubmitting = true;
    this.errorMessage = '';

    // Generate random transaction ID for free webinars, otherwise use user input
    const userTransactionId = this.isFreeWebinar() ? this.generateRandomTransactionId() : this.transactionReference.trim();
  

    if (this.isExistingUser) {
      // User already exists, call webinar subscription API
      const isFreeWebinar = this.webinarDetails?.price === 0 || this.webinarDetails?.price === '0' || this.webinarDetails?.price === '0.00';
      const subscriptionData = {
        webinarId: this.webinarDetails?.id,
        userId: this.userId,
        amount: parseInt(this.webinarDetails?.price),
        transactionId: userTransactionId,
      };

      this.authService.subscribeToWebinar(subscriptionData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          console.log('Webinar subscription successful:', response);
          // Show thank you page
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.showThankYouPage = true;
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Webinar subscription error:', error);
          
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Webinar subscription failed. Please try again.';
          }
        }
      });
    } else {
      // New user, call user registration API
      const registrationData = {
        first_name: this.firstName,
        user_type: 'trainee',
        is_verified: false,
        is_first_time_login: true,
        subscriptionId: '06fff7d5-00b6-4679-afd8-d3dd4ae3beda',
        is_active: true,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        job_title: this.jobTitle,
        company: this.company,
        transactionId: userTransactionId,

      };

      this.authService.registerWebinarWithUser(registrationData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          const isFreeWebinar = this.webinarDetails?.price === 0 || this.webinarDetails?.price === '0' || this.webinarDetails?.price === '0.00';
          const subscriptionData = {
            webinarId: this.webinarDetails?.id,
            userId: response.user.id,
            amount: parseInt(this.webinarDetails?.price),
            transactionId: userTransactionId,
          };
          this.authService.subscribeToWebinar(subscriptionData).subscribe({
            next: (response: any) => {
              this.isSubmitting = false;
              console.log('Webinar subscription successful:', response);
              // Show thank you page
              window.scrollTo({ top: 0, behavior: 'smooth' });
              this.showThankYouPage = true;
            },
            error: (error: any) => {
              this.isSubmitting = false;
              console.error('Webinar subscription error:', error);
              
              if (error.error && error.error.message) {
                this.errorMessage = error.error.message;
              } else {
                this.errorMessage = 'Webinar subscription failed. Please try again.';
              }
            }
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Registration error:', error);
          
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
    }
  }

  /**
   * Register trainee with payment
   */
  registerTrainee(form: any): void {
    if (form.invalid) {
      return;
    }

    if (!this.isEmailVerified) {
      this.errorMessage = 'Please verify your email first.';
      return;
    }

    if (!this.isOtpVerified) {
      this.errorMessage = 'Please verify your OTP first.';
      return;
    }

    // Only require transaction reference for paid webinars
    if (!this.isFreeWebinar() && (!this.transactionReference || this.transactionReference.trim() === '')) {
      this.errorMessage = 'Please enter your transaction reference number.';
      return;
    }

    // Proceed with registration
    this.completeRegistration();
  }

  /**
   * Social login (Google)
   */
  socialLogin(provider: string): void {
    // Implement social login functionality
    console.log('Social login with:', provider);
  }

  /**
   * Navigate to home page
   */
  goToHome(): void {
    this.router.navigate(['/home']);
  }

} 