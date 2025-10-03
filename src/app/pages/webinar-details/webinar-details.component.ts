import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebinarService } from './webinar-details.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: "app-webinar-details",
  templateUrl: "./webinar-details.component.html",
  styleUrls: ["./webinar-details.component.css"],
})
export class WebinarDetailsComponent implements OnInit {
  webinar: any = null;
  isLoading = true;
  errorMessage = "";
  showModal = false;
  userId: any = ""; // Assume this comes from sessionStorage/session
  trainers: any = [];
  currentIndex = 0;
  currentPageType: any = '';
  isLoggedIn = false; // ✅ Track login state
  email: string = '';
  alertMessage: string | null = null;
  alertClass: string = '';
  joinNow: boolean = false;
  timeLeft: string = '';
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webinarService: WebinarService,
    private authServices: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = JSON.parse(sessionStorage.getItem("user") ?? "{}"); // Use '{}' if null
    this.isLoggedIn = !!sessionStorage.getItem('authToken'); // ✅ Check login status
    const webinarId = this.route.snapshot.paramMap.get("id");
    const pageType = this.route.snapshot.paramMap.get('style');
    if (pageType == 'masterclass') {
      this.currentPageType = 'Master Class'
    } else if (pageType == 'events') {
      this.currentPageType = 'Event'
    } else {
      this.currentPageType = 'Training'
    }
    if (webinarId) {
      this.fetchWebinarDetails(webinarId);
    } else {
      this.errorMessage = "Webinar ID is missing";
      this.isLoading = false;
    }

    sessionStorage.removeItem('successreturnUrl');
    sessionStorage.removeItem('successreturnUrl');
    setInterval(() => {
      this.nextSlide();
    }, 5000);
    if (this.currentPageType === 'Event') {
      this.setupCountdown();
    }
  }

  fetchWebinarDetails(id: string) {
    this.webinarService.getWebinarById(id).subscribe({
      next: (data) => {
        this.webinar = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load webinar details.";
        this.isLoading = false;
      },
    });
  }

  /** Opens the confirmation modal */
  openConfirmationModal() {
    this.showModal = true;
  }

  /** Closes the confirmation modal */
  closeModal() {
    this.showModal = false;
  }


  /** Adds webinar to cart */
  subscribeToWebinar() {
    this.showModal = false;

    const token = sessionStorage.getItem("authToken");

    if (!token) {
      // Get the return URL correctly
      const returnUrl = this.router.url;

      // Redirect user to login and save return URL
      this.router.navigate(["/auth/login"], { state: { returnUrl } });
      return;
    }

    if (!this.webinar || !this.userId) return;

    const requestBody = {
      webinarId: this.webinar?.id,
      userId: this.userId?.id,
      transactionId: `TXN${Date.now()}`,
      amount: parseFloat(this.webinar?.price)
    };
    const successreturnUrl = this.router.url;
    sessionStorage.setItem('successreturnUrl', successreturnUrl);// ✅ Store it in sessionStorage
    this.webinarService.registerForWebinarFlow(requestBody).subscribe({
      next: () => {
        setTimeout(() => {
          const returnUrl = sessionStorage.getItem('successreturnUrl')
          if (returnUrl) {
            sessionStorage.removeItem('successreturnUrl'); // ✅ Clear the stored returnUrl
            this.router.navigateByUrl(returnUrl);
            this.router.navigate([returnUrl]).then(() => {
              window.location.reload(); // **Force page reload**
            });
          } else {
            this.router.navigate(['/webinar']).then(() => {
              window.location.reload(); // **Force page reload**
            });
          }
        }, 1000);
      },
      error: () => {
        this.errorMessage = "Failed to add to cart. Try again.";
      },
    });
  }
  prevSlide() {
    this.currentIndex =
      this.currentIndex === 0
        ? this.webinar.trainers.length - 1
        : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex =
      (this.currentIndex + 1) % this.webinar.trainers.length;
  }


  sendOtp() {
    if (!this.email) {
      this.showAlert('Please enter your email', 'alert-danger');
      return;
    }

    this.authServices.sendOtp(this.email).subscribe({
      next: (response) => {
        this.showAlert(response.message, 'alert-success');

        // ✅ Get the return URL from router state or default to '/'
        const returnUrl = this.router.url;
        sessionStorage.setItem('returnUrl', returnUrl);// ✅ Store it in sessionStorage

        setTimeout(() => {
          this.router.navigate(['/auth/validate'], { state: { email: this.email, returnUrl } });
        }, 2000);
      },
      error: () => {
        this.showAlert('Failed to send OTP. Please try again.', 'alert-danger');
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

  socialLogin(provider: string,type:string,id:string) {
    const returnUrl = this.router.url;
    sessionStorage.setItem('returnUrl', returnUrl);// ✅ Store it in sessionStorage
    if (provider === 'google') {
      window.location.href = `${environment.api}/auth/google`;
    } else {
      this.router.navigate(['/auth/register',type,id])
    }
  }

  redirectToLogin() {
    const returnUrl = this.router.url; // Get the current URL
    sessionStorage.setItem('returnUrl', returnUrl); // ✅ Store it in sessionStorage
    this.router.navigate(['/auth/login']);
  }

  userRegistration() {
    const returnUrl = this.router.url;
    sessionStorage.setItem('returnUrl', returnUrl);// ✅ Store it in sessionStorage
    this.router.navigate(['/auth/register']);
  }

  login() {
    const returnUrl = this.router.url;
    sessionStorage.setItem('returnUrl', returnUrl);// ✅ Store it in sessionStorage
    this.router.navigate(['/auth/login']);
  }
  setupCountdown() {
    const checkJoinTime = () => {
      if (!this.webinar?.start_time) return;
  
      const eventIST = new Date(this.webinar.start_time).getTime(); // Already in IST
      const joinIST = eventIST - 10 * 60 * 1000; // 10 mins before
  
      const now = new Date().getTime(); // Browser local time (assumed to match IST for you)
  
      if (now >= joinIST) {
        this.joinNow = true;
        this.timeLeft = '';
        clearInterval(this.countdownInterval);
      } else {
        const diff = joinIST - now;
        const hrs = Math.floor((diff / 1000 / 60 / 60) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        this.timeLeft = `${this.pad(hrs)}h ${this.pad(mins)}m ${this.pad(secs)}s`;
      }
    };
  
    checkJoinTime();
    this.countdownInterval = setInterval(checkJoinTime, 1000);
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  /** Get display price with Free label for zero amount */
  getDisplayPrice(): string {
    const price = parseFloat(this.webinar?.price);
    if (price === 0 || price === 0.00) {
      return 'Free';
    }
    return `₹${price}`;
  }

  /** Check if content contains HTML tags */
  containsHtml(content: string): boolean {
    if (!content) return false;
    const htmlTagRegex = /<[^>]*>/;
    return htmlTagRegex.test(content);
  }

  /** Safely render HTML content */
  sanitizeHtml(content: string): string {
    if (!content) return '';
    
    // If content doesn't contain HTML, return as is
    if (!this.containsHtml(content)) {
      return content;
    }
    
    // Return HTML content for rendering with [innerHTML]
    return content;
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}