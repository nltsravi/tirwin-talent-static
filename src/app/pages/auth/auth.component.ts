// auth.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit, OnDestroy {
  email: string = "";
  alertMessage: string | null = null;
  alertClass: string = "";

  images: string[] = [
    "https://i.fbcd.co/products/original/business-webinar-banner-template-016-89fc8245993d84c4a7a26785e067019fed05eb8887eddb0f7b8ca9603001a01d.jpg",
    "https://i.fbcd.co/products/original/business-webinar-banner-template-021-8265ba94e05234c977a44e21e96c0622d09a2e318183b9f572df8016f51440e7.jpg",
  ];
  currentImage: string = this.images[0];
  private intervalId: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // ✅ Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // ✅ Save the token to local storage
      localStorage.setItem('authToken', token);

      // ✅ Update authentication state
      this.authService.setAuthState(true);

      // ✅ Clear the token from the URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // ✅ Redirect to the home page or desired page
      this.getProfile()
    }
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

  sendOtp() {
    if (!this.email) {
      this.showAlert("Please enter your email", "alert-danger");
      return;
    }

    this.authService.sendOtp(this.email).subscribe({
      next: (response) => {
        this.showAlert(response.message, "alert-success");
        const returnUrl = this.router.getCurrentNavigation()?.extras.state?.["returnUrl"] || "/webinar";

        setTimeout(() => {
          this.router.navigate(["/auth/validate"], {
            state: { email: this.email, returnUrl },
          });
        }, 2000);
      },
      error: (error) => {
        console.error("Error sending OTP:", error);
        this.showAlert("Failed to send OTP. Please try again.", "alert-danger");
      },
    });
  }

  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertClass = type;
    setTimeout(() => this.clearAlert(), 5000);
  }

  clearAlert() {
    this.alertMessage = null;
    this.alertClass = "";
  }

  // ✅ Social Login Function for Google
  socialLogin(social: string) {
    if (social === "google") {
      window.location.href = 'https://dev.api.tirwintalent.com/api/auth/google';
    }
  }

  getProfile() {
    // Fetch profile data
    this.authService.getProfile().subscribe({
      next: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        this.authService.setAuthState(true); // Update auth state
        this.showAlert('Login successful', 'alert-success');

        setTimeout(() => {
          const returnUrl = localStorage.getItem('returnUrl')
          if(returnUrl) {
            localStorage.removeItem('returnUrl'); // ✅ Clear the stored returnUrl
            this.router.navigateByUrl(returnUrl);
            this.router.navigate([returnUrl]).then(() => {
              window.location.reload(); // **Force page reload**
            });
          } else {
            this.router.navigate(['/webinar']).then(() => {
              window.location.reload(); // **Force page reload**
            });
          }
        }, 2000);
      },
      error: (error) => {
        console.error('Profile fetch error:', error);
        this.showAlert('Failed to fetch user profile.', 'alert-danger');
      }
    });
  }
}