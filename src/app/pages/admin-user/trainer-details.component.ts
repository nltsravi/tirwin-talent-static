import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trainer-details',
  templateUrl: './trainer-details.component.html',
  styleUrls: ['./trainer-details.component.css']
})
export class TrainerDetailsComponent implements OnInit {
  trainer: any = null;
  loading = true;
  error = '';
  starsArray = [1, 2, 3, 4, 5];
  currentIndex = 0;
  toastMessage = '';
  showToastFlag = false;
  isApproving: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Check if user is admin
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/auth/login']);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.user_type !== 'admin') {
        this.router.navigate(['/auth/login']);
        return;
      }
    } catch (e) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const trainerId = this.route.snapshot.paramMap.get('id');
    if (trainerId) {
      this.http.get<any>(`${environment.api}/admin/users/${trainerId}/details`).subscribe({
        next: (data) => {
          const user = data.user;
          this.trainer = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            job_title: user.job_title,
            organization: user.trainer_organization || user.organization,
            profile_image: user.trainer_profile_image || user.profile_image,
            linkedin_profile: user.trainer_linkedin_url || user.linkedin_id,
            bio: user.trainer_bio,
            expertise: user.trainer_expertise,
            experience: user.trainer_experience_years,
            rating: user.trainer_rating,
            totalWebinars: user.trainer_total_sessions,
            followers: user.trainer_followers,
            // Add more fields as needed
          };
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load trainer details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No trainer ID provided.';
      this.loading = false;
    }
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  onCancel() {
    this.router.navigate(['/admin/user']);
  }

  onApprove() {
    if (!this.trainer?.id) return;
    
    this.isApproving = true;
    this.errorMessage = '';

    this.http.put(`${environment.api}/admin/users/${this.trainer.id}/verify`, {})
      .subscribe({
        next: () => {
          this.isApproving = false;
          this.toastr.success('Trainer approved successfully!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
          setTimeout(() => {
            this.router.navigate(['/admin/user']);
          }, 2000);
        },
        error: (error) => {
          this.isApproving = false;
          this.errorMessage = error.error.message || 'Failed to approve trainer.';
          this.toastr.error(this.errorMessage, 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
        }
      });
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.showToastFlag = true;
    setTimeout(() => {
      this.showToastFlag = false;
    }, 2000);
  }

  prevSlide() {
    if (!this.trainer?.testimonials) return;
    this.currentIndex = this.currentIndex === 0 ? this.trainer.testimonials.length - 1 : this.currentIndex - 1;
  }

  nextSlide() {
    if (!this.trainer?.testimonials) return;
    this.currentIndex = (this.currentIndex + 1) % this.trainer.testimonials.length;
  }
}

@Component({
  selector: 'app-trainer-details-public',
  templateUrl: './trainer-details-public.component.html',
  styleUrls: ['./trainer-details.component.css']
})
export class TrainerDetailsPublicComponent implements OnInit {
  trainer: any = null;
  loading = true;
  error = '';
  starsArray = [1, 2, 3, 4, 5];
  currentIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const trainerId = this.route.snapshot.paramMap.get('id');
    if (trainerId) {
      this.http.get<any>(`${environment.api}/admin/users/${trainerId}/details`).subscribe({
        next: (data) => {
          const user = data.user;
          this.trainer = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            job_title: user.job_title,
            organization: user.trainer_organization || user.organization,
            profile_image: user.trainer_profile_image || user.profile_image,
            linkedin_profile: user.trainer_linkedin_url || user.linkedin_id,
            bio: user.trainer_bio,
            expertise: user.trainer_expertise,
            experience: user.trainer_experience_years,
            rating: user.trainer_rating,
            totalWebinars: user.trainer_total_sessions,
            followers: user.trainer_followers,
          };
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load trainer details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No trainer ID provided.';
      this.loading = false;
    }
  }
} 