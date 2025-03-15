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
  userId: any = ""; // Assume this comes from localStorage/session
  trainers: any = [];
  currentIndex = 0;
  currentPageType: any = '';
  isLoggedIn = false; // ✅ Track login state
  email: string = '';
  alertMessage: string | null = null;
  alertClass: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webinarService: WebinarService,
    private authServices: AuthService
  ) { }

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem("user") ?? "{}"); // Use '{}' if null
    this.isLoggedIn = !!localStorage.getItem('authToken'); // ✅ Check login status
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

    localStorage.removeItem('successreturnUrl');
    localStorage.removeItem('successreturnUrl');
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  fetchWebinarDetails(id: string) {
    this.webinarService.getWebinarById(id).subscribe({
      next: (data) => {
        this.webinar = data;
        console.log("this.webinar",this.webinar)
        //Below if condition is only for demo.
        if (data.id == "fbde0931-bf80-4687-afa3-83d9a1694e26") {
          this.webinar = {
            id: this.webinar?.id,
            title: this.webinar?.title,
            description: this.webinar?.description,
            type: this.webinar?.type,
            tags: this.webinar?.tags,
            start_time: this.webinar?.start_time,
            end_time: this.webinar?.end_time,
            is_paid: this.webinar?.is_paid,
            price: this.webinar?.price,
            is_active: this.webinar?.is_active,
            created_at: this.webinar?.created_at,
            updated_at: this.webinar?.updated_at,
            category: this.webinar?.category,
            subcategory: this.webinar?.subcategory,
            trainers: [
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "Balaji Ethirajan (Panelist)",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "Global CHRO – TVS Supply chain solutions Ltd",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "15",
                total_webinars: null,
                followers: 200,
                profile_image: "https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "Archna Bharadwaj (Panelist)",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "Head HR – InterGlobe Transport",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "15",
                total_webinars: null,
                followers: 200,
                profile_image: "https://t3.ftcdn.net/jpg/02/33/46/24/360_F_233462402_Fx1yke4ng4GA8TJikJZoiATrkncvW6Ib.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "Rakesh Rajan (Panelist)",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "Head HR – Worldwide Flight services",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "25",
                total_webinars: null,
                followers: 200,
                profile_image: "https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "XXX (Panelist)",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "Head HR - TBD",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "18",
                total_webinars: null,
                followers: 200,
                profile_image: "https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
              {
                id: "2a8a8ca9-c7bd-44e9-b6cc-7c6e4dec4746",
                name: "Venkatesh Kuppuswamy (Moderator)",
                user_id: "2b2f614d-940e-439d-9c75-70fa131a566f",
                bio: "Expert in global supply chain optimization, AI-driven\n                            logistics, and last-mile delivery strategies.",
                organization: "COO – Tirwin Management Services",
                linkedin_profile: "dfdsfgsdfg345345sdfgdsfgdfsgdfg",
                experience: "15",
                total_webinars: null,
                followers: 200,
                profile_image: "https://static.vecteezy.com/system/resources/thumbnails/036/594/092/small_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",
                specialties: null,
                created_at: "2025-02-04T18:24:34.369Z",
                updated_at: "2025-02-04T18:24:34.369Z",
              },
            ],
            media: [
              {
                id: "c5c68464-f618-4555-9a40-373565ef8897",
                media_url:
                  "https://as2.ftcdn.net/v2/jpg/00/82/51/67/1000_F_82516786_78Ru4V50ZHLf05gQm6tLEd0X03tCw6Kt.jpg",
                media_type: "banner",
                created_at: "2025-02-22T12:46:36.936Z",
              },
            ],
            attendees: [],
            subscriptions: [],
            subscribedUserIds: [],
            isUserRegistered: this.webinar?.isUserRegistered,
          };
        } else {
          this.webinar = data;
        }
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

    const token = localStorage.getItem("authToken");

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
    localStorage.setItem('successreturnUrl', successreturnUrl);// ✅ Store it in localStorage
    this.webinarService.registerForWebinarFlow(requestBody).subscribe({
      next: () => {
        setTimeout(() => {
          const returnUrl = localStorage.getItem('successreturnUrl')
          if(returnUrl) {
            localStorage.removeItem('successreturnUrl'); // ✅ Clear the stored returnUrl
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
        localStorage.setItem('returnUrl', returnUrl);// ✅ Store it in localStorage
  
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

  socialLogin(provider: string) {
    const returnUrl = this.router.url;
    localStorage.setItem('returnUrl', returnUrl);// ✅ Store it in localStorage
  if (provider === 'google') {
      window.location.href = `${environment.api}/auth/google`;
    } else {
      this.router.navigate(['/auth/register'])
    }
  }

  redirectToLogin() {
    const returnUrl = this.router.url; // Get the current URL
    localStorage.setItem('returnUrl', returnUrl); // ✅ Store it in localStorage
    this.router.navigate(['/auth/login']);
}

userRegistration() {
  const returnUrl = this.router.url;
  localStorage.setItem('returnUrl', returnUrl);// ✅ Store it in localStorage
  this.router.navigate(['/auth/register']);
}

login() {
  const returnUrl = this.router.url;
  localStorage.setItem('returnUrl', returnUrl);// ✅ Store it in localStorage
  this.router.navigate(['/auth/login']);
}
}