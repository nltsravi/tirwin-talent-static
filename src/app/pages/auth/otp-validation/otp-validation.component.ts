import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
  styleUrls: ['./otp-validation.component.css']
})
export class OTPComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private authService:AuthService, private dataService:DataService) {}
    number: string = '';
    email:string='';
    message:string='';
  // Custom Carousel Images
  images: string[] = [
    'https://i.ytimg.com/vi/0kfPCjk4sdg/maxresdefault.jpg',
    'https://i.fbcd.co/products/original/business-webinar-banner-template-021-8265ba94e05234c977a44e21e96c0622d09a2e318183b9f572df8016f51440e7.jpg',
  ];
  currentImage: string = this.images[0];
  private intervalId: any;

  ngOnInit() {
   const user = this.dataService.getUserData();
   if (user) {
     this.email = user.email;
   }
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

  validateOtp() {
    if (!this.number) {
      alert('Please enter your otp code');
      return;
    }
       try {
         this.authService.validateOtpCode({ email: this.email, otpCode: this.number.toString() }).subscribe({
           next: (response) => {this.message = response.message,  this.router.navigate(["/profile/trainer"]);},
           error: (error) => { alert("Invalid OTP");console.error("Error sending otp:", error);},
         });
       } catch (e) {
         console.log(e);
       }
    //this.router.navigate(['/profile/trainer'])
  }

  linkedInLogin() {
    console.log('LinkedIn login triggered!');
    // Implement LinkedIn OAuth API logic
  }
}