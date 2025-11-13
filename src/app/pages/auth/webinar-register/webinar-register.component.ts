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
      next: () => {
        this.isEmailVerified = true;
        this.isOtpVerified = true;
        this.isVerifyingEmail = false;
        this.isOtpSent = true;

        this.authService.checkIfUserExists(this.email.trim()).subscribe({
          next: (response) => {
            this.handleUserExistenceResponse(response);
          },
          error: (error) => {
            console.error('Error checking user existence:', error);
            this.handleUserExistenceResponse(null);
          }
        });
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
    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const userTransactionId = this.isFreeWebinar() ? this.generateRandomTransactionId() : this.transactionReference.trim();

    this.authService.checkIfUserExists(this.email.trim()).subscribe({
      next: (response) => {
        this.handleUserExistenceResponse(response);
        this.finalizeRegistration(userTransactionId);
      },
      error: (error) => {
        console.error('Error checking user existence:', error);
        this.isExistingUser = false;
        this.userId = '';
        this.finalizeRegistration(userTransactionId);
      }
    });
  }

  private handleUserExistenceResponse(response: any): void {
    const user = response?.existingUser || response?.user || response?.data?.user || response?.data || null;
    const exists = response?.exists ?? !!user;

    if (exists && user) {
      this.isExistingUser = true;
      this.userId = user.id || user.userId || user.user_id || '';

      const firstName = user.first_name || user.firstName || user.firstname;
      const lastName = user.last_name || user.lastName || user.lastname;
      const jobTitle = user.job_title || user.jobTitle || user.jobtitle;
      const company = user.company || user.organization || user.organisation;
      const phone = user.phone || user.phone_number || user.mobile || user.mobileNumber;

      if (firstName) {
        this.firstName = firstName;
        this.isFirstNameDisabled = true;
      }
      if (lastName) {
        this.lastName = lastName;
        this.isLastNameDisabled = true;
      }
      if (jobTitle) {
        this.jobTitle = jobTitle;
        this.isJobTitleDisabled = true;
      }
      if (company) {
        this.company = company;
        this.isCompanyDisabled = true;
      }
      if (phone) {
        this.phone = phone;
        this.isPhoneDisabled = true;
      }
    } else {
      this.isExistingUser = false;
      this.userId = '';
      this.isFirstNameDisabled = false;
      this.isLastNameDisabled = false;
      this.isJobTitleDisabled = false;
      this.isCompanyDisabled = false;
      this.isPhoneDisabled = false;
    }
  }

  private finalizeRegistration(userTransactionId: string): void {
    if (this.isExistingUser && this.userId) {
      const subscriptionData = {
        webinarId: this.webinarDetails?.id,
        userId: this.userId,
        amount: parseInt(this.webinarDetails?.price),
        transactionId: userTransactionId,
      };

      this.authService.subscribeToWebinar(subscriptionData).subscribe({
        next: () => {
          this.isSubmitting = false;
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
          const subscriptionData = {
            webinarId: this.webinarDetails?.id,
            userId: response.user.id,
            amount: parseInt(this.webinarDetails?.price),
            transactionId: userTransactionId,
          };

          this.authService.subscribeToWebinar(subscriptionData).subscribe({
            next: () => {
              this.isSubmitting = false;
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

    // Call payment initiate API
    this.paymentService.initiatePayment(paymentRequest).subscribe({
      next: (response: any) => {
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
          clearInterval(this.iframeMonitorInterval);
          this.isPaymentProcessing = false;
          this.paymentWindow = null;
          return;
        }

        // Try to access window URL
        if (this.paymentWindow && this.paymentWindow.location) {
          const windowUrl = this.paymentWindow.location.href;
          
          // Check if the URL contains success indicators
          if (this.isSuccessUrl(windowUrl)) {
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
    // Try to monitor iframe URL changes to detect success page
    try {
      const iframe = document.querySelector('.payment-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        const iframeUrl = iframe.contentWindow.location.href;
        
        // Check if the URL contains success indicators
        if (this.isSuccessUrl(iframeUrl)) {
          this.handlePaymentSuccess({ url: iframeUrl });
        }
      }
    } catch (error) {
      // Cross-origin restrictions prevent accessing iframe content
      // This is expected for external payment gateways
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
        'ref_id',
        'merchantTxnId',
       'merchant_txn_id',
      ];
      
      for (const paramName of paramNames) {
        const value = urlObj.searchParams.get(paramName);
        if (value) {
          return value;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }

  /**
   * Complete registration after successful payment
   */
  async completeRegistrationAfterPayment(transactionId: string): Promise<void> {
    const webinarId = this.route.snapshot.paramMap.get('webinarId');
    const webinarType = this.route.snapshot.paramMap.get('webinarType') || 'masterclass';

    // Check if user exists (userId is present)
    if (this.userId) {
      // Existing user - directly subscribe to webinar
      const subscriptionData = {
        webinarId: webinarId,
        userId: this.userId,
        transactionId: transactionId,
        amount: parseInt(this.webinarDetails?.price),
      };

      this.authService.subscribeToWebinar(subscriptionData).subscribe({
        next: (response: any) => {
          // Navigate to webinar registration success page
          this.router.navigate(['/auth/register', webinarType, webinarId], { queryParams: { success: 'true', txnId: transactionId } }).then(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        },
        error: (error: any) => {
          console.error('Error completing registration API:', error);
          
          // Still navigate to success page since payment was successful
          this.router.navigate(['/auth/webinar-registration-success']).then(() => {
            this.toastr.warning('Payment successful, but registration confirmation pending. Please contact support if needed.');
          });
        }
      });
    } else {
      // New user - register user first, then subscribe to webinar
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

      this.authService.registerWebinarWithUser(registrationData).subscribe({
        next: (response) => {
          // Now subscribe to webinar with the newly created user ID
          const subscriptionData = {
            webinarId: webinarId,
            userId: response.user.id,
            amount: parseInt(this.webinarDetails?.price),
            transactionId: transactionId,
          };

          this.authService.subscribeToWebinar(subscriptionData).subscribe({
            next: (subscriptionResponse: any) => {
              // Navigate to webinar registration success page
              this.router.navigate(['/auth/register', webinarType, webinarId], { queryParams: { success: 'true', txnId: transactionId } }).then(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            },
            error: (error: any) => {
              console.error('Webinar subscription error:', error);
              
              // Still navigate to success page since payment was successful
              this.router.navigate(['/auth/webinar-registration-success']).then(() => {
                this.toastr.warning('Payment successful, but registration confirmation pending. Please contact support if needed.');
              });
            }
          });
        },
        error: (error) => {
          console.error('User registration error:', error);
          
          // Still navigate to success page since payment was successful
          this.router.navigate(['/auth/webinar-registration-success']).then(() => {
            this.toastr.warning('Payment successful, but registration confirmation pending. Please contact support if needed.');
          });
        }
      });
    }
  }

} 