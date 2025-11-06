import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../auth.service';
import { PaymentService } from '../payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-webinar-register',
  templateUrl: './webinar-register.component.html',
  styleUrls: ['./webinar-register.component.css']
})
export class WebinarRegisterComponent implements OnInit, OnDestroy {
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

  // Payment modal state (deprecated - now using window)
  showPaymentModal: boolean = false;
  paymentRedirectUrl: any = null;
  isPaymentProcessing: boolean = false;
  iframeMonitorInterval: any = null;
  paymentWindow: Window | null = null;

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
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check if redirected from payment loading page with success
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['success'] === 'true') {
        // Show thank you page directly
        this.showThankYouPage = true;
        console.log('Payment successful, showing thank you page');
      }
    });
    
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

    // Listen for messages from payment iframe
    window.addEventListener('message', this.handlePaymentMessage.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up event listener
    window.removeEventListener('message', this.handlePaymentMessage.bind(this));
    
    // Clear monitoring interval
    if (this.iframeMonitorInterval) {
      clearInterval(this.iframeMonitorInterval);
    }
    
    // Close payment window if open
    if (this.paymentWindow && !this.paymentWindow.closed) {
      this.paymentWindow.close();
      this.paymentWindow = null;
    }
  }

  /**
   * Handle messages from payment gateway iframe
   */
  handlePaymentMessage(event: MessageEvent): void {
    // For security, verify the origin if you know the payment gateway domain
    // if (event.origin !== 'https://payment-gateway.com') return;
    
    console.log('Received message from iframe:', event.data);
    
    // Check if payment is successful
    if (event.data && event.data.status === 'success') {
      this.handlePaymentSuccess(event.data);
    }
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

  /**
   * Initiate payment process
   */
  initiatePayment(): void {
    // Validate form
    if (!this.email || !this.phone) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    // Set processing state
    this.isPaymentProcessing = true;

    // Prepare payment request
    // Convert amount to integer (remove decimals)
    const amountValue = parseFloat(this.webinarDetails?.price || '99');
    const amountInteger = Math.floor(amountValue);

    const paymentRequest = {
      amount: amountInteger,
      currencyCode: '356',
      customerEmailID: this.email,
      customerMobileNo: this.phone,
      payType: '0'
    };

    console.log('Initiating payment with request:', paymentRequest);

    // Call payment initiate API
    this.paymentService.initiatePayment(paymentRequest).subscribe({
      next: (response: any) => {
        console.log('Payment initiation response:', response);
        
        if (response && response.redirectUrl) {
          // Open payment gateway in new window (400x600)
          const windowFeatures = 'width=400,height=600,left=100,top=100,resizable=yes,scrollbars=yes';
          this.paymentWindow = window.open(response.redirectUrl, 'PaymentGateway', windowFeatures);
          
          this.isPaymentProcessing = false;
          
          this.toastr.success('Redirecting to payment gateway...');
          
          // Start monitoring payment window for success
          this.startWindowMonitoring();
        } else {
          this.toastr.error('Failed to get payment redirect URL');
          this.isPaymentProcessing = false;
        }
      },
      error: (error: any) => {
        console.error('Payment initiation error:', error);
        this.toastr.error(error.error?.message || 'Failed to initiate payment. Please try again.');
        this.isPaymentProcessing = false;
      }
    });
  }

  /**
   * Start monitoring payment window for success page
   */
  startWindowMonitoring(): void {
    // Clear any existing interval
    if (this.iframeMonitorInterval) {
      clearInterval(this.iframeMonitorInterval);
    }

    // Check payment window URL every 2 seconds
    this.iframeMonitorInterval = setInterval(() => {
      try {
        // Check if window is closed
        if (this.paymentWindow && this.paymentWindow.closed) {
          console.log('Payment window closed by user');
          clearInterval(this.iframeMonitorInterval);
          this.isPaymentProcessing = false;
          this.paymentWindow = null;
          return;
        }

        // Try to access window URL
        if (this.paymentWindow && this.paymentWindow.location) {
          const windowUrl = this.paymentWindow.location.href;
          console.log('Monitoring payment window URL:', windowUrl);
          
          // Check if the URL contains success indicators
          if (this.isSuccessUrl(windowUrl)) {
            console.log('Success URL detected in payment window');
            clearInterval(this.iframeMonitorInterval);
            
            // Close payment window
            if (this.paymentWindow) {
              this.paymentWindow.close();
              this.paymentWindow = null;
            }
            
            this.handlePaymentSuccess({ url: windowUrl });
          }
        }
      } catch (error) {
        // Cross-origin restrictions - cannot access window URL
        // This is normal for external payment gateways
        // We'll rely on postMessage instead
        // Silent fail, continue monitoring for window close or postMessage
      }
    }, 2000); // Check every 2 seconds
  }

  /**
   * Close payment modal (deprecated - now closes payment window)
   */
  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentRedirectUrl = null;
    
    // Close payment window if open
    if (this.paymentWindow && !this.paymentWindow.closed) {
      this.paymentWindow.close();
      this.paymentWindow = null;
    }
    
    // Stop monitoring
    if (this.iframeMonitorInterval) {
      clearInterval(this.iframeMonitorInterval);
      this.iframeMonitorInterval = null;
    }
  }

  /**
   * Handle payment iframe load event
   */
  onPaymentIframeLoad(): void {
    console.log('Payment iframe loaded');
    
    // Try to monitor iframe URL changes to detect success page
    try {
      const iframe = document.querySelector('.payment-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        const iframeUrl = iframe.contentWindow.location.href;
        console.log('Iframe URL:', iframeUrl);
        
        // Check if the URL contains success indicators
        if (this.isSuccessUrl(iframeUrl)) {
          this.handlePaymentSuccess({ url: iframeUrl });
        }
      }
    } catch (error) {
      // Cross-origin restrictions prevent accessing iframe content
      // This is expected for external payment gateways
      console.log('Cannot access iframe URL (cross-origin restriction)');
    }
  }

  /**
   * Check if URL indicates successful payment
   */
  isSuccessUrl(url: string): boolean {
    const successIndicators = [
      '/auth/register',
      'success=true',
      '/webinar-registration-success',
      'payment-success',
      'registration-success'
    ];
    
    return successIndicators.some(indicator => 
      url.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Handle successful payment
   */
  handlePaymentSuccess(data: any): void {
    console.log('Payment successful, processing registration', data);
    
    // Close the payment window if it's still open
    if (this.paymentWindow && !this.paymentWindow.closed) {
      this.paymentWindow.close();
      this.paymentWindow = null;
    }
    
    // Stop monitoring
    if (this.iframeMonitorInterval) {
      clearInterval(this.iframeMonitorInterval);
      this.iframeMonitorInterval = null;
    }
    
    // Close the modal (legacy)
    this.showPaymentModal = false;
    this.paymentRedirectUrl = null;
    
    // Extract transaction ID from URL or data
    let transactionId = null;
    
    // Try to extract from URL parameter
    if (data.url) {
      transactionId = this.extractTransactionIdFromUrl(data.url);
    }
    
    // Fallback to data properties
    if (!transactionId && (data.transactionId || data.txnId)) {
      transactionId = data.transactionId || data.txnId;
    }
    
    console.log('Extracted transaction ID:', transactionId);
    
    // Call subscribe API before showing success page
    if (transactionId) {
      this.completeRegistrationAfterPayment(transactionId);
    } else {
      // If no transaction ID, still navigate to success page but log warning
      console.warn('No transaction ID found, navigating to success page anyway');
      this.router.navigate(['/auth/webinar-registration-success']).then(() => {
        this.toastr.warning('Payment completed, but transaction ID not found. Please contact support if you don\'t receive confirmation.');
      });
    }
  }

  /**
   * Extract transaction ID from URL parameters
   */
  extractTransactionIdFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      
      // Check common parameter names for transaction ID
      const paramNames = [
        'txnId',
        'transactionId',
        'transaction_id',
        'txn_id',
        'orderId',
        'order_id',
        'paymentId',
        'payment_id',
        'refId',
        'ref_id'
      ];
      
      for (const paramName of paramNames) {
        const value = urlObj.searchParams.get(paramName);
        if (value) {
          console.log(`Found transaction ID in URL parameter '${paramName}':`, value);
          return value;
        }
      }
      
      console.log('No transaction ID found in URL parameters');
      return null;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }

  /**
   * Complete registration after successful payment
   */
  completeRegistrationAfterPayment(transactionId: string): void {
    const webinarId = this.route.snapshot.paramMap.get('webinarId');
    const webinarType = this.route.snapshot.paramMap.get('webinarType') || 'masterclass';
    
    console.log('Completing registration after payment with transaction:', transactionId);
    console.log('User ID:', this.userId);

    // Check if user exists (userId is present)
    if (this.userId) {
      // Existing user - directly subscribe to webinar
      const subscriptionData = {
        webinarId: webinarId,
        userId: this.userId,
        transactionId: transactionId,
        amount: parseInt(this.webinarDetails?.price),
      };

      console.log('Existing user - Calling webinar subscribe API');
      console.log('Subscription data:', subscriptionData);

      this.authService.subscribeToWebinar(subscriptionData).subscribe({
        next: (response: any) => {
          console.log('Registration API completed successfully:', response);
          
          // Navigate to webinar registration success page
          this.router.navigate(['/auth/register', webinarType, webinarId], { queryParams: { success: 'true', txnId: transactionId } }).then(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Navigated to success page');
          });
        },
        error: (error: any) => {
          console.error('Error completing registration API:', error);
          
          // Still navigate to success page since payment was successful
          this.router.navigate(['/auth/webinar-registration-success']).then(() => {
            console.log('Navigated to success page (with warning)');
            this.toastr.warning('Payment successful, but registration confirmation pending. Please contact support if needed.');
          });
        }
      });
    } else {
      // New user - register user first, then subscribe to webinar
      console.log('New user - Registering user first');
      
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
        transactionId: transactionId,
      };

      console.log('Registration data:', registrationData);

      this.authService.registerWebinarWithUser(registrationData).subscribe({
        next: (response) => {
          console.log('User registration successful:', response);
          
          // Now subscribe to webinar with the newly created user ID
          const subscriptionData = {
            webinarId: webinarId,
            userId: response.user.id,
            amount: parseInt(this.webinarDetails?.price),
            transactionId: transactionId,
          };

          console.log('Subscribing to webinar with new user ID:', response.user.id);
          console.log('Subscription data:', subscriptionData);

          this.authService.subscribeToWebinar(subscriptionData).subscribe({
            next: (subscriptionResponse: any) => {
              console.log('Webinar subscription successful:', subscriptionResponse);
              
              // Navigate to webinar registration success page
              this.router.navigate(['/auth/register', webinarType, webinarId], { queryParams: { success: 'true', txnId: transactionId } }).then(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                console.log('Navigated to success page');
              });
            },
            error: (error: any) => {
              console.error('Webinar subscription error:', error);
              
              // Still navigate to success page since payment was successful
              this.router.navigate(['/auth/webinar-registration-success']).then(() => {
                console.log('Navigated to success page (with warning)');
                this.toastr.warning('Payment successful, but registration confirmation pending. Please contact support if needed.');
              });
            }
          });
        },
        error: (error) => {
          console.error('User registration error:', error);
          
          // Still navigate to success page since payment was successful
          this.router.navigate(['/auth/webinar-registration-success']).then(() => {
            console.log('Navigated to success page (with warning)');
            this.toastr.warning('Payment successful, but registration confirmation pending. Please contact support if needed.');
          });
        }
      });
    }
  }

} 