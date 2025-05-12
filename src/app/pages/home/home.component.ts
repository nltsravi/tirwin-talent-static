import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  courses = [
    {
      id: "cadad5fc-3dc0-4ec7-85dc-07325147025b",
      badge: "Trending in Logistics",
      image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/logistics.png",
      title: "Logistics",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: true,
      description: "Holistic knowledge dealing with the practical aspects of moving and storing goods, information, and resources from the point of origin to the point of consumption.",
    },
    {
      id: "7ee7bc4b-c557-43b6-a3da-590abfed4142",
      badge: "Build Your Career",
      image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/cargo.png",
      title: "Freight & Cargo Management",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: true,
      description: "Knowledge related to the process of planning, executing, and controlling the transportation of goods via air, sea, rail, and road. This includes tasks such as route planning, carrier selection, freight consolidation, and documentation.",
    },
    {
      id: "32e1f0b3-2268-496d-9e99-453ca2f179ee",
      badge: "New Logistics Skills",
      image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/warehouse.png",
      title: "Warehouse Operations",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: false,
      description: "Knowledge related to the operation and management of warehouses, ensuring the efficient storage, handling, and movement of goods. This includes inventory control, order picking, packing, and organization of storage spaces.",
    },
    {
      id: "0a64c164-d333-49a0-bbe5-ff5ce30d5b0c",
      badge: "Top Logistics Skills",
      image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/green-logistics.png",
      title: "Sustainability & Green Logistics",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: false,
      description: "Knowledge of best practices that minimize the environmental impact of logistics activities. This includes reducing carbon emissions, optimizing transportation routes, using sustainable packaging, and promoting recycling.",
    },
    {
      id: "61477099-485f-4072-83a8-f4b7508ce086",
      badge: "Trending in Logistics",
      image: "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/logistics.png",
      title: "Logistics Technology & Innovation",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: false,
      description: "Knowledge related to the application of advanced technologies and innovative solutions to improve logistics processes, such as automation, artificial intelligence, the Internet of Things (IoT), blockchain, and data analytics.",
    },
  ];

  showBecomeTrainerSection = true;
  trainers: any[] = [];
  isLoadingTrainers = false;
  trainersError = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.user_type === 'admin' || user.user_type === 'trainer') {
          this.showBecomeTrainerSection = false;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    this.fetchTrainers();
  }

  fetchTrainers() {
    this.isLoadingTrainers = true;
    this.trainersError = '';
    const url = `${environment.api}/admin/users/by-type?userType=trainer&isVerified=true`;
    this.http.get(url).subscribe({
      next: (res: any) => {
        let trainers: any[] = [];
        if (Array.isArray(res)) {
          trainers = res;
        } else if (res && Array.isArray(res.data)) {
          trainers = res.data;
        }
        // Sort by createdAt or created_at descending if available
        trainers = trainers.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
          const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
          return dateB - dateA;
        });
        // Only show if at least 3 trainers, and at most 5
        if (trainers.length >= 3) {
          this.trainers = trainers.slice(0, 5);
        } else {
          this.trainers = [];
        }
        this.isLoadingTrainers = false;
      },
      error: (err) => {
        this.trainersError = 'Failed to load trainers.';
        this.isLoadingTrainers = false;
      }
    });
  }

  navigateToLogistics(item: any) {
    if (item?.redirect) {
      if (item?.title === 'Logistics') {
        this.router.navigate(['/webinar/events'], { queryParams: { type: 'logistics' } });
      } else {
        this.router.navigate(['/webinar/masterclass'], { queryParams: { type: 'freight-cargo-management' } });
      }
    }
  }

  navigateToTrainerRegistration(event: Event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.router.navigate(['/auth/trainer-registration']);
  }

  navigateToTrainerDetails(event: Event, trainer: any) {
    event.preventDefault();
    this.router.navigate(['/trainer/details', trainer.id]);
  }
}