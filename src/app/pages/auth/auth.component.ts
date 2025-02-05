import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {


  constructor(private router: Router, private authService:AuthService, private dataService:DataService ) {}
  email: string = '';
  message: string='';

  // Custom Carousel Images
  images: string[] = [
    'https://i.fbcd.co/products/original/business-webinar-banner-template-016-89fc8245993d84c4a7a26785e067019fed05eb8887eddb0f7b8ca9603001a01d.jpg',
    'https://i.fbcd.co/products/original/business-webinar-banner-template-021-8265ba94e05234c977a44e21e96c0622d09a2e318183b9f572df8016f51440e7.jpg',
  ];
  currentImage: string = this.images[0];
  private intervalId: any;

  ngOnInit() {
    // Start Custom Image Slider with Smooth Fade
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000); // Change image every 5 seconds
  }

  nextImage() {
    const currentIndex = this.images.indexOf(this.currentImage);
    const nextIndex = (currentIndex + 1) % this.images.length;
    this.currentImage = this.images[nextIndex];
  }

  ngOnDestroy() {
    // Stop interval when component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  sendOtp() {
    if (!this.email) {
      alert("Please enter your email");
      return;
    }
    console.log("OTP sent to", this.email);
    // Call API to send OTP

    if (!this.email.trim()) return;
      try{
        this.authService.sendOtp({ email: this.email }).subscribe({
          next: (response) => (this.message = response.message),
          error: (error) => console.error("Error sending otp:", error),
        });
      }
      catch(e){
        console.log(e);
      }
      let userData = {email : this.email}
      this.dataService.setUserData(userData);
      this.router.navigate(["/auth/validate"]);
  }

  linkedInLogin() {
    console.log('LinkedIn login triggered!');
    // Implement LinkedIn OAuth API logic
  }
}