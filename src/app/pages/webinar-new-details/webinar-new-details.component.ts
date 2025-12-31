import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  displayDate?: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  platform: string;
  whyAttend: string[];
  learn: string[];
  audience: string[];
  proof: string[];
  careerJourney: { title: string; icon: string; points: string[]; }[];
  faqs: { q: string; a: string; }[];
  finalCtaText: string;
}

@Component({
  selector: "app-webinar-new-details",
  templateUrl: "./webinar-new-details.component.html",
  styleUrls: ["./webinar-new-details.component.css"],
})
export class WebinarNewDetailsComponent implements OnInit {
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

    // For new version, we always load from JSON file
    this.loadNewWebinarData();

    sessionStorage.removeItem('successreturnUrl');
    sessionStorage.removeItem('successreturnUrl');
    setInterval(() => {
      this.nextSlide();
    }, 5000);
    if (this.currentPageType === 'Event') {
      this.setupCountdown();
    }
  }

  /** Opens the confirmation modal */
  openConfirmationModal() {
    this.showModal = true;
  }

  /** Redirects to webinar registration page */
  redirectToWebinarRegistration() {
    const webinarId = this.route.snapshot.paramMap.get('id');
    const webinarType = this.route.snapshot.paramMap.get('style') || 'masterclass';

    if (!webinarId) {
      console.error('Webinar ID not found in route parameters');
      this.router.navigate(['/auth/register']);
      return;
    }

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

    // For new version, we'll redirect to registration instead
    this.redirectToWebinarRegistration();
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

  socialLogin(provider: string, type: string, id: string) {
    const returnUrl = this.router.url;
    sessionStorage.setItem('returnUrl', returnUrl);// ✅ Store it in sessionStorage
    if (provider === 'google') {
      window.location.href = `${environment.api}/auth/google`;
    } else {
      // Use route parameters instead of passed parameters
      const webinarId = this.route.snapshot.paramMap.get('id');
      const webinarType = this.route.snapshot.paramMap.get('style') || 'masterclass';

      if (webinarId) {
        this.router.navigate(['/auth/register', webinarType, webinarId]);
      }
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
    this.http.get<WebinarData>('/assets/webinar_data.json', this.getNoCacheHttpOptions()).subscribe({
      next: (data) => {
        this.fallbackData = data;
      },
      error: (error) => {
        console.error('Error loading fallback data:', error);
      }
    });
  }

  // Load new webinar data from JSON file
  loadNewWebinarData(): void {
    this.http.get<WebinarData>('/assets/webinar_data.json', this.getNoCacheHttpOptions()).subscribe({
      next: (data) => {
        // Create a webinar object from new data
        this.webinar = {
          id: 'new-webinar-001',
          title: data.title,
          description: data.tagline,
          display_date: data.displayDate,
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
        console.log('New webinar data loaded successfully');
      },
      error: (error) => {
        console.error('Error loading new webinar data:', error);
        this.errorMessage = "Failed to load webinar details.";
        this.isLoading = false;
      }
    });
  }

  private getNoCacheHttpOptions() {
    const noCacheHeaders = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return {
      headers: noCacheHeaders,
      params: { _ts: Date.now().toString() }
    };
  }

  // Display methods with API data fallback to JSON data
  getDisplayTitle(): string {
    return this.webinar?.title || this.fallbackData?.title || 'Webinar Title';
  }

  getDisplayTagline(): string {
    return this.webinar?.description || this.fallbackData?.tagline || 'Webinar Description';
  }

  getDisplayPrice(): string {
    let price = 0;
    if (this.webinar?.price) {
      price = parseFloat(this.webinar.price);
    } else {
      price = this.fallbackData?.priceINR || 99;
    }

    // Display "Free" if price is 0 or 0.00
    if (price === 0 || price === 0.00) {
      return 'Free';
    }

    return `₹${price}`;
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

  /** Get course objectives with HTML support */
  getCourseObjectives(): any[] {
    if (this.webinar?.additional_info?.course_objectives) {
      return this.webinar.additional_info.course_objectives;
    }
    // Convert fallback data to the same structure
    return this.fallbackData?.learn?.map(item => ({
      Title: '',
      Description: item
    })) || [];
  }

  /** Get key takeaways with HTML support */
  getKeyTakeaways(): any[] {
    if (this.webinar?.additional_info?.key_take_aways) {
      return this.webinar.additional_info.key_take_aways;
    }
    // Convert fallback data to the same structure if available
    return this.fallbackData?.learn?.map(item => ({
      Title: '',
      Description: item
    })) || [];
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

  getCareerJourney(): { title: string; icon: string; points: string[]; }[] {
    return this.fallbackData?.careerJourney || [];
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

  /**
   * Check if date is 01 Jan 2000 (placeholder date for TBD)
   */
  isTBDDate(dateString: string): boolean {
    if (!dateString) return true;
    const date = new Date(dateString);
    return date.getFullYear() === 2000 && date.getMonth() === 0 && date.getDate() === 1;
  }

  formatDate(dateString: string): string {
    if (!dateString || this.isTBDDate(dateString)) {
      return 'TBD';
    }
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
    if (!timeString || this.isTBDDate(timeString)) {
      return 'TBD';
    }

    let date: Date;

    if (timeString.includes('T')) {
      const parsedDate = new Date(timeString);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate;
      } else {
        const [hours, minutes] = timeString.split(':');
        date = new Date();
        date.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0);
      }
    } else {
      const [hours, minutes] = timeString.split(':');
      date = new Date();
      date.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0);
    }

    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  scrollToDetails(): void {
    const detailsElement = document.getElementById('webinar-details');
    if (detailsElement) {
      detailsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  formatBenefitText(benefit: string): string {
    // Make specific words bold
    return benefit
      .replace(/\bcareer opportunities\b/gi, '<strong>career opportunities</strong>')
      .replace(/\bTirwin Management\b/gi, '<strong>Tirwin Management</strong>')
      .replace(/\bemerging trends, compliance, and technology\b/gi, '<strong>emerging trends, compliance, and technology</strong>')
      .replace(/\bjob-ready in just 6–8 weeks\b/gi, '<strong>job-ready in just 6–8 weeks</strong>')
      .replace(/\bexclusive pathway to the Logistics Career Compass Program\b/gi, '<strong>exclusive pathway to the Logistics Career Compass Program</strong>');
  }

  getProofPointIcon(index: number): string {
    const icons = ['🎯', '💼', '📈', '🚀', '🏆', '⭐', '💡', '🎓'];
    return icons[index] || '✓';
  }

  formatProofPointText(text: string): string {
    if (!text) return text;

    console.log('formatProofPointText - Original:', text);

    // Test with hardcoded example first
    if (text.includes('100+')) {
      return text.replace('100+', '<span class="highlight-number">100+</span>');
    }
    if (text.includes('15+')) {
      return text.replace('15+', '<span class="highlight-number">15+</span>');
    }
    if (text.includes('10+')) {
      return text.replace('10+', '<span class="highlight-number">10+</span>');
    }

    // Original regex approach
    let formattedText = text
      .replace(/\b(\d+)\+/g, '<span class="highlight-number">$1+</span>')
      .replace(/\b(\d+)\s*years?\b/gi, '<span class="highlight-number">$1 years</span>');

    console.log('formatProofPointText - Formatted:', formattedText);
    return formattedText;
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
