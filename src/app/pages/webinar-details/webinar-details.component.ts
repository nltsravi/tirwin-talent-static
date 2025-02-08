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
  isRegistering = false;
  successMessage = '';
  errorMessage = '';
  showModal = false; // State to show/hide modal

  constructor(private route: ActivatedRoute, private router: Router, private webinarService: WebinarService) {}

  ngOnInit(): void {
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
        console.error('Error fetching webinar:', error);
        this.errorMessage = 'Failed to load webinar details. Please try again later.';
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

  /** Confirms registration after clicking "Yes, Register" */
  confirmRegistration() {
    this.showModal = false; // Hide modal
    this.registerForWebinar();
  }

  /** Registers for the webinar and refreshes page on success */
  registerForWebinar() {
    if (!this.webinar) return;
    this.isRegistering = true;
    this.successMessage = '';

    this.webinarService.registerForWebinar(this.webinar.id, this.webinar.is_paid ? this.webinar.price : 0).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.isRegistering = false;

        // ✅ Refresh the webinar details after successful registration
        setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 1000);
      },
      error: (error) => {
        console.error('Error registering for webinar:', error);
        this.errorMessage = 'Failed to register. Please try again later.';
        this.isRegistering = false;
      }
    });
  }
}