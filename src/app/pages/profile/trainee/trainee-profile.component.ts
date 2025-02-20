import { Component, OnInit } from '@angular/core';
import { TraineeProfileService } from './trainee-profile.service';
import { HttpClient } from '@angular/common/http';

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

  selectedFile: File | null = null;
  isUploading = false;
  uploadUrl = '';

  constructor(private profileService: TraineeProfileService, private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');

    if (token) {
      this.profileService.getProfile(token).subscribe({
        next: (data) => {
          this.trainer = {
            name: `${data.first_name} ${data.last_name}`,
            jobTitle: data.user_type === 'trainee' ? 'Trainee' : 'Trainer',
            company: 'N/A',
            bio: 'No bio available',
            image: data.profile_image || 'https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg',
            followers: 0,
            totalWebinars: 0,
            email: data.email,
            phone: data.phone,
            isVerified: data.is_verified,
            userId: data.id // Store user ID for profile updates
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

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.getUploadUrl(this.selectedFile.type);
    }
  }

  // Get the pre-signed URL from the backend
  getUploadUrl(fileType: string) {
    const userId = this.trainer.userId;
    const url = `https://dev.api.tirwintalent.com/api/users/profile-image/upload-url`;
  
    const body = { userId, fileType };
  
    this.http.post<{ uploadUrl: string; imageUrl: string }>(url, body).subscribe({
      next: (response) => {
        this.uploadUrl = response.uploadUrl;
        this.uploadToS3(this.uploadUrl, response.imageUrl);
      },
      error: (error) => {
        console.error('Error fetching upload URL:', error);
      }
    });
  }

  // Upload image to AWS S3
  uploadToS3(uploadUrl: string, imageUrl: string) {
    if (!this.selectedFile) return;

    this.isUploading = true;

    this.http.put(uploadUrl, this.selectedFile, {
      headers: { 'Content-Type': this.selectedFile.type },
    }).subscribe({
      next: () => {
        this.isUploading = false;
        this.updateUserProfile(imageUrl);
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.isUploading = false;
      }
    });
  }

  // Update user profile image URL in the database
  updateUserProfile(imageUrl: string) {
    const userId = this.trainer.userId;
    const url = `https://dev.api.tirwintalent.com/api/users/${userId}`;
    
    this.http.patch(url, { profile_image: imageUrl }).subscribe({
      next: () => {
        this.trainer.image = imageUrl;
        window.location.reload()
      },
      error: (error) => {
        console.error('Error updating profile image:', error);
      }
    });
  }
}