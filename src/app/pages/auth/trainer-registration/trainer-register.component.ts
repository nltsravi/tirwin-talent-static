import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainerRegisterService } from './trainer-register.service';

@Component({
  selector: 'app-trainer-register',
  templateUrl: './trainer-register.component.html',
  styleUrls: ['./trainer-register.component.css']
})
export class TrainerRegisterComponent implements OnInit {
  step = 1;
  steps = ['Personal Info', 'Professional Details', 'Public Profile'];
  progress = 0;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  isFormSubmitted = false; // ✅ Hide form after submission
  selectedFile: File | null = null;
  selectedFileName: string = '';
  photoFile: File | null = null;
  photoPreview: string | null = null;

  trainer = {
    first_name: '',
    last_name: '',
    email: '',
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

  experienceOptions: string[] = ['0-2 years', '3-5 years', '6-10 years', '10+ years'];
  employmentTypeOptions: string[] = ['Employed', 'Consultant', 'Freelancer'];
  specialtiesOptions: string[] = ['Fleet Management', 'Customs Compliance', 'Cold Chain Logistics', 'Route Optimization'];

  constructor(private trainerService: TrainerRegisterService, private router: Router) {}

  ngOnInit() {
    // Example: Assume user info is stored in localStorage as 'user' JSON
    const userStr = localStorage.getItem('user');
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
    if (this.step === 1 && (!this.trainer.first_name || !this.trainer.last_name || !this.trainer.email || !this.trainer.phone)) {
      this.errorMessage = 'All fields in Personal Info are required!';
      return false;
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
    if (this.step === 3 && (!this.trainer.bio || !this.trainer.linkedin_profile)) {
      this.errorMessage = 'Bio and LinkedIn profile are required!';
      return false;
    }
    return true;
  }

  registerTrainer() {
    if (!this.validateStep()) return;
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.trainerService.registerTrainer(this.trainer).subscribe({
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.errorMessage = '';
    }
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