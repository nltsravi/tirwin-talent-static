import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WebinarService } from './webinar-details.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

interface WebinarData {
  title: string;
  tagline: string;
  priceINR: number;
  regUrl: string;
  altRegUrl: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  platform: string;
  whyAttend: string[];
  learn: string[];
  audience: string[];
  proof: string[];
  faqs: { q: string; a: string; }[];
  finalCtaText: string;
}

@Component({
  selector: "app-webinar-details",
  templateUrl: "./webinar-details.component.html",
  styleUrls: ["./webinar-details.component.css"],
})
export class WebinarDetailsComponent implements OnInit {
  webinar: any = null;
  fallbackData: WebinarData | null = null;
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
    private authServices: AuthService,
    private http: HttpClient
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
    
    // Load fallback data
    this.loadFallbackData();
    
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
        console.error('API Error for webinar ID:', id, error);
        
        // Check if this is the specific webinar ID that should use fallback data
        if (id === '4e86e649-bb3c-45c4-a2ff-be4c625e2ac8') {
          console.log('API failed for webinar ID:', id, '- Loading fallback data from JSON file');
          this.loadFallbackWebinarData();
        } else {
          console.log('API failed for webinar ID:', id, '- Showing error message');
          this.errorMessage = "Failed to load webinar details.";
          this.isLoading = false;
        }
      },
    });
  }

  /** Opens the confirmation modal */
  openConfirmationModal() {
    this.showModal = true;
  }

  /** Redirects to webinar registration page */
  redirectToWebinarRegistration() {
    // Check if user is logged in
    if (!this.isLoggedIn) {
      // Redirect to login with return URL
      const returnUrl = this.router.url;
      sessionStorage.setItem('returnUrl', returnUrl);
      this.router.navigate(['/auth/login']);
      return;
    }

    // Get webinar details
    const webinarId = this.webinar?.id || '4e86e649-bb3c-45c4-a2ff-be4c625e2ac8';
    const webinarType = this.route.snapshot.paramMap.get('style') || 'masterclass';
    
    // Redirect to webinar registration page
    this.router.navigate(['/auth/register', webinarType, webinarId]);
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

  // Load fallback data from JSON file
  loadFallbackData(): void {
    this.http.get<WebinarData>('/assets/webinar_data.json').subscribe({
      next: (data) => {
        this.fallbackData = data;
      },
      error: (error) => {
        console.error('Error loading fallback data:', error);
      }
    });
  }

  // Load webinar data from fallback when API fails for specific ID
  loadFallbackWebinarData(): void {
    this.http.get<WebinarData>('/assets/webinar_data.json').subscribe({
      next: (data) => {
        // Create a webinar object from fallback data
        this.webinar = {
          id: '4e86e649-bb3c-45c4-a2ff-be4c625e2ac8',
          title: data.title,
          description: data.tagline,
          price: data.priceINR,
          start_time: data.date + 'T' + data.startTime + ':00',
          end_time: data.date + 'T' + data.endTime + ':00',
          category: { name: 'Logistics Leadership' },
          subcategory: { name: 'Career Development' },
          is_paid: true,
          isUserRegistered: false,
          registrationClosed: false,
          additional_info: {
            benefits: data.whyAttend.map(item => ({ Title: '', Description: item })),
            course_objectives: data.learn.map(item => ({ Title: '', Description: item })),
            target_audience: data.audience.map(item => ({ Title: '', Description: item })),
            key_take_aways: data.learn.map(item => ({ Title: '', Description: item }))
          },
          trainer: {
            user: {
              first_name: 'Tirwin',
              last_name: 'Management'
            },
            organization: 'Tirwin Management Services',
            profile_image: 'https://via.placeholder.com/100',
            experience: '15+',
            bio: 'Leading logistics and supply chain education with 15+ years of industry experience.'
          }
        };
        this.fallbackData = data;
        this.isLoading = false;
        console.log('Fallback webinar data loaded successfully');
      },
      error: (error) => {
        console.error('Error loading fallback webinar data:', error);
        this.errorMessage = "Failed to load webinar details.";
        this.isLoading = false;
      }
    });
  }

  // Display methods with API data fallback to JSON data
  getDisplayTitle(): string {
    return this.webinar?.title || this.fallbackData?.title || 'Webinar Title';
  }

  getDisplayTagline(): string {
    return this.webinar?.description || this.fallbackData?.tagline || 'Webinar Description';
  }

  getDisplayPrice(): string {
    if (this.webinar?.price) {
      return `₹${this.webinar.price}`;
    }
    return `₹${this.fallbackData?.priceINR || 99}`;
  }

  getDisplayBenefits(): string[] {
    if (this.webinar?.additional_info?.benefits) {
      return this.webinar.additional_info.benefits.map((item: any) => item.Description || item.Title);
    }
    return this.fallbackData?.whyAttend || [];
  }

  getDisplayLearn(): string[] {
    if (this.webinar?.additional_info?.course_objectives) {
      return this.webinar.additional_info.course_objectives.map((item: any) => item.Description || item.Title);
    }
    return this.fallbackData?.learn || [];
  }

  getDisplayAudience(): string[] {
    if (this.webinar?.additional_info?.target_audience) {
      return this.webinar.additional_info.target_audience.map((item: any) => item.Description || item.Title);
    }
    return this.fallbackData?.audience || [];
  }

  getDisplayProof(): string[] {
    return this.fallbackData?.proof || [];
  }

  getDisplayFaqs(): { q: string; a: string; }[] {
    return this.fallbackData?.faqs || [];
  }

  getCtaPrimaryLabel(): string {
    return this.fallbackData?.ctaPrimaryLabel || 'Register Now @ ₹99';
  }

  getCtaSecondaryLabel(): string {
    return this.fallbackData?.ctaSecondaryLabel || 'Book My Seat Now @ ₹99';
  }

  getFinalCtaText(): string {
    return this.fallbackData?.finalCtaText || 'Your career in Logistics starts here. Learn from industry leaders, gain clarity, and take the first step toward your future with Tirwin.';
  }

  getAltRegUrl(): string {
    return this.fallbackData?.altRegUrl || '#';
  }

  getPlatform(): string {
    return this.fallbackData?.platform || 'Zoom (link will be shared after registration)';
  }

  getFallbackDate(): string {
    return this.fallbackData?.date || '2025-10-02';
  }

  getFallbackStartTime(): string {
    return this.fallbackData?.startTime || '16:30';
  }

  getFallbackEndTime(): string {
    return this.fallbackData?.endTime || '18:30';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-IN', options);
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-IN', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  scrollToDetails(): void {
    const detailsElement = document.getElementById('webinar-details');
    if (detailsElement) {
      detailsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}