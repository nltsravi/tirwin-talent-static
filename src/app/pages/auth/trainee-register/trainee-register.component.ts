import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../model/user.model';
import { Router } from '@angular/router';


@Component({
  selector: "app-trainee-register",
  templateUrl: "./trainee-register.component.html",
  styleUrls: ["./trainee-register.component.css"],
})
export class TraineeRegisterComponent implements OnInit, OnDestroy {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  jobTitle: string = "";
  phone: string = "";
  linkedin_id: string = "";
  subscriptionId:string="";
  company: string = "";
  userType:string="";
  message: string = "";
  constructor(private router: Router, private authService: AuthService) {}
  // Carousel images
  images: string[] = [
    "https://i.ytimg.com/vi/0kfPCjk4sdg/maxresdefault.jpg",
    "https://i.fbcd.co/products/original/business-webinar-banner-template-021-8265ba94e05234c977a44e21e96c0622d09a2e318183b9f572df8016f51440e7.jpg",
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
    console.log("Registering trainee:", {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      jobTitle: this.jobTitle,
      phone: this.phone,
      company: this.company,
    });

    if (this.email) {
      const userData: User = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        job_title: this.jobTitle,
        phone: this.phone,
        company: this.company,
        linkedin_id: this.linkedin_id,
        user_type: 'trainee',
        subscriptionId: "ea0f4f30-6959-433a-a4c9-6e5da7978278", //Need to remove hardcoded value
      };
      this.authService.registerTrainee(userData).subscribe({
        next: (response) => {
          console.log("User created:", response);
          this.message = "User created successfully!";
          alert("User Signed up successfully.Please login");
          this.router.navigate(["/auth/login"]);
        },
        error: (error) => {
          console.error("Error:", error);
          this.message = "Error creating user";
          alert(
            "Error while submitting user details.Kindly verify the details"
          );
        },
      });
    } else {
      alert("Please fill the form correctly");
    }
  }
}