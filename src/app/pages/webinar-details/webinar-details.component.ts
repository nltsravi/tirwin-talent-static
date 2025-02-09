import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebinarService } from './webinar-details.service';

@Component({
  selector: 'app-webinar-details',
  templateUrl: './webinar-details.component.html',
  styleUrls: ['./webinar-details.component.css']
})
export class WebinarDetailsComponent implements OnInit {
  webinar: any = null;
  isLoading = true;
  errorMessage = '';
  showModal = false;
  userId: any = ''; // Assume this comes from localStorage/session

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webinarService: WebinarService
  ) {}

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user') ?? '{}'); // Use '{}' if null
    const webinarId = this.route.snapshot.paramMap.get('id');
    if (webinarId) {
      this.fetchWebinarDetails(webinarId);
    } else {
      this.errorMessage = 'Webinar ID is missing';
      this.isLoading = false;
    }
  }

  fetchWebinarDetails(id: string) {
    this.webinarService.getWebinarById(id).subscribe({
      next: (data) => {
        this.webinar = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load webinar details.';
        this.isLoading = false;
      }
    });
  }

  /** Opens the confirmation modal */
  openConfirmationModal() {
    this.showModal = true;
  }

  /** Closes the confirmation modal */
  closeModal() {
    this.showModal = false;
  }

  /** Adds webinar to cart */
  addToCart() {
    this.showModal = false;
    if (!this.webinar || !this.userId) return;

    const requestBody = {
      webinarId: this.webinar?.id,
      userId: this.userId?.id
    };

    this.webinarService.addToCart(requestBody).subscribe({
      next: () => {
        this.router.navigate(['/checkout']); // Redirect to checkout page
      },
      error: () => {
        this.errorMessage = 'Failed to add to cart. Try again.';
      }
    });
  }
}