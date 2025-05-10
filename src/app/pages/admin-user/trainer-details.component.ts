import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

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
    this.http.put(`${environment.api}/admin/users/${this.trainer.id}/verify`, {}).subscribe({
      next: () => {
        this.showToast('Trainer approved successfully!');
        setTimeout(() => {
          this.router.navigate(['/admin/user']);
        }, 2000);
      },
      error: () => {
        this.showToast('Failed to approve trainer.');
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