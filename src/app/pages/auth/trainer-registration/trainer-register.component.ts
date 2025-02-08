import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TrainerRegisterService } from './trainer-register.service';

@Component({
  selector: 'app-trainer-register',
  templateUrl: './trainer-register.component.html',
  styleUrls: ['./trainer-register.component.css']
})
export class TrainerRegisterComponent {
  step = 1;
  steps = ['Personal Info', 'Professional Details', 'Training Specialties', 'Public Profile'];
  progress = 0;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  trainer = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    organization: '',
    experience: '',
    specialties: [],
    linkedin_profile: '',
    bio: '',
    profile_image: 'https://example.com/profile.jpg', // Default image
    subscription_id: '06fff7d5-00b6-4679-afd8-d3dd4ae3beda',
    public_profile: false  // ✅ Added this
  };

  experienceOptions = ['0-2 years', '3-5 years', '6-10 years', '10+ years'];
  specialtiesOptions = ['Fleet Management', 'Customs Compliance', 'Cold Chain Logistics', 'Route Optimization'];

  constructor(private trainerService: TrainerRegisterService, private router: Router) {}

  nextStep() {
    if (!this.validateStep()) return;
    if (this.step < 4) {
      this.step++;
      this.progress = (this.step - 1) * 33;
    }
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
      this.progress = (this.step - 1) * 33;
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
      if (!this.trainer.job_title || !this.trainer.organization || !this.trainer.experience) {
        this.errorMessage = 'All fields in Professional Details are required!';
        return false;
      }
    }

    if (this.step === 3) {
      if (this.trainer.specialties.length === 0) {
        this.errorMessage = 'Please select at least one specialty!';
        return false;
      }
    }

    if (this.step === 4) {
      if (!this.trainer.bio || !this.trainer.linkedin_profile) {
        this.errorMessage = 'Bio and LinkedIn profile are required!';
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

    this.trainerService.registerTrainer(this.trainer).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        setTimeout(() => {
          this.router.navigate(['/auth/validate-otp'], { queryParams: { email: this.trainer.email } });
        }, 1000);
      },
      error: (error) => {
        console.error('Error registering trainer:', error);
        this.errorMessage = error.error.message || 'Failed to register. Please try again later.';
        this.isSubmitting = false;
      }
    });
  }
}