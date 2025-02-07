import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebinarService } from './webinar-details.service';

@Component({
  selector: 'app-webinar-details',
  templateUrl: './webinar-details.component.html',
  styleUrls: ['./webinar-details.component.css']
})
export class WebinarDetailsComponent implements OnInit {
  webinar: any = null;  // Ensure webinar is initialized
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private webinarService: WebinarService) {}

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
        this.webinar = data; // Assign the fetched webinar data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching webinar:', error);
        this.errorMessage = 'Failed to load webinar details. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}