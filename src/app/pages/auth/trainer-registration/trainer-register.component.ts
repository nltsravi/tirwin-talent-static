import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainerRegisterService } from './trainer-register.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

interface TrainerData {
  first_name: string;
  last_name: string;
  email: string;
  countryCode: string;
  phone: string;
  job_title: string;
  organization: string;
  experience: string;
  employmentType: string;
  specialties: string[];
  resume_url: string;
  linkedin_profile: string;
  bio: string;
  profile_image: string;
  subscription_id: string;
  public_profile: boolean;
  training_modes: {
    online: boolean;
    offline: boolean;
    hybrid: boolean;
  };
  additional_info: {
    resume_url?: string;
    [key: string]: any;
  };
  doc_urls: string[];
}

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
  isUploadingResume = false;
  uploadPhotoUrl = '';
  uploadResumeUrl = '';
  emailDisabled = false;
  isEmailVerified = false;
  isVerifyingEmail = false;
  isOtpVerified = false;
  isVerifyingOtp = false;
  otpCode = '';

  userAsTrainer={
    first_name: '',
    last_name: '',
    email: '',
    user_type:'trainee',
    is_verified:false,
    is_first_time_login: false,
    subscriptionId: '06fff7d5-00b6-4679-afd8-d3dd4ae3beda',
    is_active:true,
  }
  trainer: TrainerData = {
    first_name: '',
    last_name: '',
    email: '',
    countryCode: '+91', // Default country code (India)
    phone: '',
    job_title: '',
    organization: '',
    experience: '',
    employmentType: '',
    specialties: [],
    resume_url: '',
    linkedin_profile: '',
    bio: '',
    profile_image: 'assets/default-avatar.png',
    subscription_id: '06fff7d5-00b6-4679-afd8-d3dd4ae3beda',
    public_profile: false,
    training_modes: { online: false, offline: false, hybrid: false },
    additional_info: {},
    doc_urls: []
  };

  experienceOptions: string[] = ['Less than 5 Years', '5-10 Years', '10-20 Years', '20+ Years'];
  employmentTypeOptions: string[] = ['Employed', 'Consultant'];
  specialtiesOptions: string[] = ['Fleet Management', 'Customs Compliance', 'Cold Chain Logistics', 'Route Optimization', 'Other'];

  // Maximum number of specialties allowed
  readonly MAX_SPECIALTIES = 3;

  // Modal specialties selection
  showSpecialtiesModal = false;
  specialtiesSearch = '';
  filteredSpecialtiesOptions: string[] = [...this.specialtiesOptions];
  tempSelectedSpecialties: string[] = [];
  showOtherInput = false;
  otherExpertise = '';

  constructor(
    private trainerService: TrainerRegisterService, 
    private router: Router, 
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Example: Assume user info is stored in sessionStorage as 'user' JSON
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user: { first_name?: string; last_name?: string; email?: string; profile_image?: string } = JSON.parse(userStr);
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
          this.trainer.profile_image = user.profile_image;
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
      if (!this.isEmailVerified) {
        this.errorMessage = 'Please verify your email address first.';
        return false;
      }
      if (!this.isOtpVerified) {
        this.errorMessage = 'Please verify your OTP first.';
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
      
      // Upload resume immediately
      this.getUploadResumeUrl(file.type);
    }
  }

  getUploadResumeUrl(fileType: string) {
    this.isUploadingResume = true;
    const userId = this.userAsTrainer.email;
    const url = `${environment.api}/users/trainer/upload-resume`;
  
    const body = { userId, fileType };
  
    this.http.post<{ uploadUrl: string; resumeUrl: string }>(url, body).subscribe({
      next: (response) => {
        this.uploadResumeUrl = response.uploadUrl;
        //this.trainer.doc_urls = [response.resumeUrl];
        this.uploadResumeToS3(this.uploadResumeUrl, response.resumeUrl);
      },
      error: (error) => {
        console.error('Error fetching upload URL:', error);
      }
    });
  }

  uploadResumeToS3(uploadUrl: string, resumeUrl: string) {
    if (!this.selectedFile) return;
    this.http.put(uploadUrl, this.selectedFile, {
      headers: { 'Content-Type': this.selectedFile.type },
    }).subscribe({
      next: () => {
        this.isUploadingResume = false;
        this.trainer.doc_urls = [resumeUrl];
      },
      error: (error) => {
        console.log(error);
        this.isUploadingResume = false;
        this.errorMessage = 'Failed to upload image.';
      }
    });
  }
  uploadResume(file: File) {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('email', this.trainer.email);
    formData.append('userId', this.trainer.email);
    formData.append('fileType', file.type);

    this.http.post(`${environment.api}/users/trainer/upload-resume`, formData)
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Resume uploaded successfully!', 'Success');
          // Store the resume URL if provided in the response
          if (response.resumeUrl) {
            this.trainer.doc_urls = [response.resumeUrl];
          }
        },
        error: (error) => {
          console.error('Error uploading resume:', error);
          this.errorMessage = error.error.message || 'Failed to upload resume. Please try again.';
          this.toastr.error(this.errorMessage, 'Error');
          // Reset file selection on error
          this.selectedFile = null;
          this.selectedFileName = '';
        }
      });
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.trainer.resume_url = ''; // Clear the resume URL
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
    this.trainer.profile_image = 'assets/default-avatar.png'; // Reset to default avatar
  }

  removeSpecialty(specialty: string, event: Event) {
    event.stopPropagation(); // Prevent dropdown from opening
    this.trainer.specialties = this.trainer.specialties.filter(s => s !== specialty);
  }

  verifyEmail() {
    if (!this.trainer.email) {
      this.errorMessage = 'Please enter an email address first.';
      return;
    }

    this.isVerifyingEmail = true;
    this.errorMessage = '';
    this.userAsTrainer.email = this.trainer.email;
    this.userAsTrainer.first_name = this.trainer.first_name;
    this.userAsTrainer.last_name = this.trainer.last_name;
    this.userAsTrainer.user_type = 'trainee';
    this.userAsTrainer.is_first_time_login = true;
    this.userAsTrainer.is_verified = false;
    this.userAsTrainer.is_active = true;

    this.http.post(`${environment.api}/users/validate-trainer-email`, this.userAsTrainer)
      .subscribe({
        next: (response: any) => {
          this.isEmailVerified = true;
          this.isVerifyingEmail = false;
          this.toastr.success('Email verified successfully!', 'Success');
        },
        error: (error) => {
          this.isVerifyingEmail = false;
          this.errorMessage = error.error.message || 'Failed to verify email. Please try again.';
          this.toastr.error(this.errorMessage, 'Error');
        }
      });
  }

  validateOtp() {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.isVerifyingOtp = true;
    this.errorMessage = '';

    this.http.post(`${environment.api}/auth/validate-trainer-otp`, {
      email: this.trainer.email,
      otpCode: this.otpCode
    }).subscribe({
      next: (response: any) => {
        this.isOtpVerified = true;
        this.isVerifyingOtp = false;
        this.toastr.success('OTP verified successfully!', 'Success');
      },
      error: (error) => {
        this.isVerifyingOtp = false;
        this.errorMessage = error.error.message || 'Failed to verify OTP. Please try again.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }

  submit() {
    if (this.validateStep()) {
      this.isSubmitting = true;
      this.errorMessage = '';

      // Prepare the trainer data
      const trainerData: TrainerData = {
        ...this.trainer,
        additional_info: {
          ...(this.trainer.additional_info || {}),
          resume_url: this.trainer.resume_url || ''
        }
      };

      this.http.post(`${environment.api}/users/trainer`, trainerData)
        .subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.toastr.success('Registration successful!', 'Success');
            this.router.navigate(['/auth/login']);
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = error.error.message || 'Registration failed. Please try again.';
            this.toastr.error(this.errorMessage, 'Error');
          }
        });
    }
  }

  onAvatarClick(isEnabled: boolean, photoInput: HTMLInputElement) {
    if (isEnabled) {
      photoInput.click();
    } else {
      this.toastr.info('Profile photo upload will be enabled after email OTP validation.', 'Info');
    }
  }

  // Modal specialties selection
  openSpecialtiesModal() {
    this.tempSelectedSpecialties = [...this.trainer.specialties];
    this.specialtiesSearch = '';
    this.filteredSpecialtiesOptions = [...this.specialtiesOptions];
    this.showSpecialtiesModal = true;
    this.showOtherInput = this.tempSelectedSpecialties.some(s => !this.specialtiesOptions.includes(s));
    if (this.showOtherInput) {
      this.otherExpertise = this.tempSelectedSpecialties.find(s => !this.specialtiesOptions.includes(s)) || '';
    }
  }

  closeSpecialtiesModal() {
    this.showSpecialtiesModal = false;
    this.showOtherInput = false;
    this.otherExpertise = '';
  }

  filterSpecialties() {
    const search = this.specialtiesSearch.trim().toLowerCase();
    if (!search) {
      this.filteredSpecialtiesOptions = [...this.specialtiesOptions];
    } else {
      this.filteredSpecialtiesOptions = this.specialtiesOptions.filter(opt => 
        opt.toLowerCase().includes(search) || opt === 'Other'
      );
    }
  }

  isSpecialtySelected(item: string): boolean {
    return this.tempSelectedSpecialties.includes(item);
  }

  toggleSpecialty(item: string) {
    if (item === 'Other') {
      this.showOtherInput = !this.showOtherInput;
      if (!this.showOtherInput) {
        // Remove the custom expertise value if 'Other' is unchecked
        this.tempSelectedSpecialties = this.tempSelectedSpecialties.filter(s => s !== this.otherExpertise.trim());
        this.otherExpertise = '';
      } else {
        // If opening the input, add the value if it exists and we haven't reached the limit
        if (this.otherExpertise.trim() && !this.tempSelectedSpecialties.includes(this.otherExpertise.trim()) && this.tempSelectedSpecialties.length < this.MAX_SPECIALTIES) {
          this.tempSelectedSpecialties.push(this.otherExpertise.trim());
        }
      }
    } else {
      if (this.tempSelectedSpecialties.includes(item)) {
        this.tempSelectedSpecialties = this.tempSelectedSpecialties.filter(s => s !== item);
      } else if (this.tempSelectedSpecialties.length < this.MAX_SPECIALTIES) {
        this.tempSelectedSpecialties.push(item);
      } else {
        this.toastr.warning(`You can select a maximum of ${this.MAX_SPECIALTIES} areas of expertise.`, 'Limit Reached');
      }
    }
  }

  updateOtherExpertise() {
    // Remove any previous custom value (not in the predefined list)
    this.tempSelectedSpecialties = this.tempSelectedSpecialties.filter(s => this.specialtiesOptions.includes(s));
    if (this.showOtherInput && this.otherExpertise.trim()) {
      this.tempSelectedSpecialties.push(this.otherExpertise.trim());
    }
  }

  applySpecialtiesModal() {
    // Remove empty strings and duplicates
    this.trainer.specialties = Array.from(new Set(this.tempSelectedSpecialties.filter(s => s.trim() !== '')));
    this.showSpecialtiesModal = false;
    this.showOtherInput = false;
    this.otherExpertise = '';
  }
}