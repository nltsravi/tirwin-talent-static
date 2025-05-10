import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainerRegisterService } from './trainer-register.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-trainer-register',
  templateUrl: './trainer-register.component.html',
  styleUrls: ['./trainer-register.component.css']
})
export class TrainerRegisterComponent implements OnInit {
  step = 1;
  steps = ['Personal Info', 'Professional Details', 'Profile'];
  progress = 0;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  isFormSubmitted = false; // ✅ Hide form after submission
  selectedFile: File | null = null;
  selectedFileName: string = '';
  photoFile: File | null = null;
  photoPreview: string | null = null;
  isUploadingPhoto = false;
  uploadPhotoUrl = '';
  emailDisabled = false;

  trainer = {
    first_name: '',
    last_name: '',
    email: '',
    countryCode: '+91', // Default country code (India)
    phone: '',
    job_title: '',
    organization: '',
    experience: '',
    employmentType: '',
    specialties: [] as string[],
    linkedin_profile: '',
    bio: '',
    profile_image: 'https://example.com/profile.jpg', // Default image
    subscription_id: '06fff7d5-00b6-4679-afd8-d3dd4ae3beda',
    public_profile: false,
    training_modes: { online: false, offline: false, hybrid: false }
  };

  experienceOptions: string[] = ['Less than 5 Years', '5-10 Years', '10-20 Years', '20+ Years'];
  employmentTypeOptions: string[] = ['Employed', 'Consultant'];
  specialtiesOptions: string[] = ['Fleet Management', 'Customs Compliance', 'Cold Chain Logistics', 'Route Optimization'];

  constructor(private trainerService: TrainerRegisterService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Example: Assume user info is stored in sessionStorage as 'user' JSON
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.first_name) {
          this.trainer.first_name = user.first_name;
        }
        if (user.last_name) {
          this.trainer.last_name = user.last_name;
        }
        if (user.email) {
          this.trainer.email = user.email;
          this.emailDisabled = true;
        }
        if (user.profile_image) {
          this.photoPreview = user.profile_image;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  nextStep() {
    if (!this.validateStep()) return;
    if (this.step < 3) {
      this.step++;
      this.progress = (this.step - 1) * 50;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
      this.progress = (this.step - 1) * 50;
    }
  }

  validateStep(): boolean {
    this.errorMessage = '';
    if (this.step === 1) {
      if (!this.trainer.first_name || !this.trainer.last_name || !this.trainer.email || !this.trainer.phone) {
        this.errorMessage = 'All fields in Personal Info are required!';
        return false;
      }
    }
    if (this.step === 2) {
      if (!this.trainer.job_title && this.trainer.employmentType === 'Employed') {
        this.errorMessage = 'Designation is required for Employed!';
        return false;
      }
      if (!this.trainer.organization && this.trainer.employmentType === 'Employed') {
        this.errorMessage = 'Organization is required for Employed!';
        return false;
      }
      if (!this.trainer.experience || !this.trainer.employmentType || this.trainer.specialties.length === 0) {
        this.errorMessage = 'All fields in Professional Details are required, including at least one specialty!';
        return false;
      }
    }
    if (this.step === 3) {
      if (!this.trainer.bio) {
        this.errorMessage = 'Professional Summary is required!';
        return false;
      }
      // LinkedIn validation: if not empty, must be a valid LinkedIn URL
      if (this.trainer.linkedin_profile && !/^https?:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[A-Za-z0-9\-_%]+/i.test(this.trainer.linkedin_profile.trim())) {
        this.errorMessage = 'Please enter a valid LinkedIn profile URL.';
        return false;
      }
    }
    return true;
  }

  registerTrainer() {
    if (!this.validateStep()) return;
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    // Combine country code and phone for backend
    const trainerData = { ...this.trainer, phone: `${this.trainer.countryCode} ${this.trainer.phone}` };
    this.trainerService.registerTrainer(trainerData).subscribe({
      next: (response) => {
        this.successMessage = 'Your profile has been submitted for verification!';
        this.isFormSubmitted = true; // ✅ Hide form
        setTimeout(() => {
          this.router.navigate(['/auth/validate-otp'], { queryParams: { email: this.trainer.email } });
        }, 2000);
      },
      error: (error) => {
        console.error('Error registering trainer:', error);
        this.errorMessage = error.error.message || 'Failed to register. Please try again later.';
        this.isSubmitting = false;
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only PDF, DOC, or DOCX files are allowed.';
        this.selectedFile = null;
        this.selectedFileName = '';
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.errorMessage = '';
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Only JPG or PNG images are allowed.';
        this.photoFile = null;
        this.photoPreview = null;
        return;
      }
      this.photoFile = file;
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.errorMessage = '';
      // Immediately upload to S3
      this.getPhotoUploadUrl(file.type);
    }
  }

  getPhotoUploadUrl(fileType: string) {
    this.isUploadingPhoto = true;
    const url = `${environment.api}/users/profile-image/upload-url`;
    // No userId for registration, so omit it
    const body = { fileType };
    this.http.post<{ uploadUrl: string; imageUrl: string }>(url, body).subscribe({
      next: (response) => {
        this.uploadPhotoUrl = response.uploadUrl;
        this.uploadPhotoToS3(response.uploadUrl, response.imageUrl);
      },
      error: (error) => {
        this.isUploadingPhoto = false;
        this.errorMessage = 'Failed to get upload URL.';
      }
    });
  }

  uploadPhotoToS3(uploadUrl: string, imageUrl: string) {
    if (!this.photoFile) return;
    this.http.put(uploadUrl, this.photoFile, {
      headers: { 'Content-Type': this.photoFile.type },
    }).subscribe({
      next: () => {
        this.isUploadingPhoto = false;
        this.trainer.profile_image = imageUrl;
      },
      error: (error) => {
        console.log(error);
        this.isUploadingPhoto = false;
        this.errorMessage = 'Failed to upload image.';
      }
    });
  }

  removePhoto() {
    this.photoFile = null;
    this.photoPreview = null;
  }

  removeSpecialty(specialty: string, event: Event) {
    event.stopPropagation(); // Prevent dropdown from opening
    this.trainer.specialties = this.trainer.specialties.filter(s => s !== specialty);
  }
}