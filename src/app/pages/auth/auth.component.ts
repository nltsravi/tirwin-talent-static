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
        const navigation = this.router.getCurrentNavigation();
        console.log(navigation);
        // Safely get return URL from state or default to webinars
        const returnUrl =
          this.router.getCurrentNavigation()?.extras.state?.["returnUrl"] ||
          "/webinar";

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

  linkedInLogin() {
    console.log("LinkedIn login triggered!");
    // Implement LinkedIn OAuth API logic
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

  socialLogin(social:string){
    if(social && social == "google"){
      
    }
  }
}