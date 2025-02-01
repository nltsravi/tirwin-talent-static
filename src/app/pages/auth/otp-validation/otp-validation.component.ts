import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-otp-validation',
  templateUrl: './otp-validation.component.html',
  styleUrls: ['./otp-validation.component.css']
})
export class OTPComponent implements OnInit, OnDestroy {
    number: string = '';

  // Custom Carousel Images
  images: string[] = [
    'https://i.ytimg.com/vi/0kfPCjk4sdg/maxresdefault.jpg',
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
    if (!this.number) {
      alert('Please enter your email');
      return;
    }
    console.log('OTP sent to', this.number);
    // Call API to send OTP
  }

  linkedInLogin() {
    console.log('LinkedIn login triggered!');
    // Implement LinkedIn OAuth API logic
  }
}