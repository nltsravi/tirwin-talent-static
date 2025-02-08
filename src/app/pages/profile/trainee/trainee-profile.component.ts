import { Component, OnInit } from '@angular/core';
import { TraineeProfileService } from './trainee-profile.service';

@Component({
  selector: 'app-trainee-profile',
  templateUrl: './trainee-profile.component.html',
  styleUrls: ['./trainee-profile.component.css']
})
export class TraineeProfileComponent implements OnInit {
  trainer: any = null;
  starsArray = [1, 2, 3, 4, 5];
  currentIndex = 0;
  errorMessage = '';

  constructor(private profileService: TraineeProfileService) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken'); // Retrieve token from local storage

    if (token) {
      this.profileService.getProfile(token).subscribe({
        next: (data) => {
          this.trainer = {
            name: `${data.first_name} ${data.last_name}`,
            jobTitle: data.user_type === 'trainee' ? 'Trainee' : 'Trainer',
            company: 'N/A', // Adjust as needed
            bio: 'No bio available', // Adjust if profile API returns a bio
            image: 'https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg',
            followers: 0, // Placeholder (Modify when API includes followers)
            totalWebinars: 0, // Placeholder (Modify when API includes webinars)
            email: data.email,
            phone: data.phone,
            isVerified: data.is_verified
          };
        },
        error: (error) => {
          console.error('Error fetching profile:', error);
          this.errorMessage = 'Failed to fetch profile data.';
        }
      });
    } else {
      this.errorMessage = 'No authentication token found.';
    }

    // Auto-slide testimonials
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.trainer.testimonials.length - 1 : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.trainer.testimonials.length;
  }
}