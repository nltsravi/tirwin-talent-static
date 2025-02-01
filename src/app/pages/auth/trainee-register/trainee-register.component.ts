import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-trainee-register',
  templateUrl: './trainee-register.component.html',
  styleUrls: ['./trainee-register.component.css']
})
export class TraineeRegisterComponent implements OnInit, OnDestroy {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  jobTitle: string = '';
  phone: string = '';
  company: string = '';

  // Carousel images
  images: string[] = [
    'https://i.ytimg.com/vi/0kfPCjk4sdg/maxresdefault.jpg',
    'https://i.fbcd.co/products/original/business-webinar-banner-template-021-8265ba94e05234c977a44e21e96c0622d09a2e318183b9f572df8016f51440e7.jpg',
  ];
  currentImage: string = this.images[0];
  private intervalId: any;

  ngOnInit() {
    // Start auto image slider
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
    // Stop interval when component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  registerTrainee() {
    console.log('Registering trainee:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      jobTitle: this.jobTitle,
      phone: this.phone,
      company: this.company
    });
    // Call API to register trainee
  }
}