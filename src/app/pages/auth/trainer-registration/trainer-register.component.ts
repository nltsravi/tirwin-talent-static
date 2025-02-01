import { Component } from '@angular/core';

@Component({
  selector: 'app-trainer-register',
  templateUrl: './trainer-register.component.html',
  styleUrls: ['./trainer-register.component.css']
})
export class TrainerRegisterComponent {
  step = 1;
  steps = ['Personal Info', 'Professional Details', 'Training Specialties', 'Public Profile'];
  progress = 0;

  trainer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    experience: '',
    specialties: [],
    modes: { online: false, offline: false, hybrid: false },
    bio: '',
    linkedin: '',
    publicProfile: false
  };

  experienceOptions = ['0-2 years', '3-5 years', '6-10 years', '10+ years'];
  specialtiesOptions = ['Fleet Management', 'Customs Compliance', 'Cold Chain Logistics', 'Route Optimization'];

  nextStep() {
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

  registerTrainer() {
    console.log('Trainer Data:', this.trainer);
  }
}