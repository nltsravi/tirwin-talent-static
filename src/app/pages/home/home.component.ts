import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(
      private router: Router,
    ) {}
  currentIndex = 0;
  /*testimonials = [
    { text: 'John is an amazing instructor, his insights into logistics are truly valuable!', author: 'Alice Smith' },
    { text: 'The webinar was well-structured and engaging. Highly recommend!', author: 'Mark Johnson' }
  ]*/
  testimonials = [{ text: "Coming soon", author: "" }];

  ngOnInit(): void {
    // Auto-slide every 5 seconds
    setInterval(() => {
      this.nextSlide();
    }, 5000);
    console.log("testset")
  }

  prevSlide() {
    this.currentIndex =
      this.currentIndex === 0
        ? this.testimonials.length - 1
        : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }
  courses = [
    {
      id: "cadad5fc-3dc0-4ec7-85dc-07325147025b",
      badge: "Trending in Logistics",
      image:
        "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/logistics.png",
      title: "Logistics",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: true,
      description:
        "Holistic knowledge dealing with the practical aspects of moving and storing goods, information, and resources from the point of origin to the point of consumption.",
    },
    {
      id: "7ee7bc4b-c557-43b6-a3da-590abfed4142",
      badge: "Build Your Career",
      image:
        "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/cargo.png",
      title: "Freight & Cargo Management",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: true,
      description:
        "Knowledge related to the process of planning, executing, and controlling the transportation of goods via air, sea, rail, and road. This includes tasks such as route planning, carrier selection, freight consolidation, and documentation.",
    },
    {
      id: "32e1f0b3-2268-496d-9e99-453ca2f179ee",
      badge: "New Logistics Skills",
      image:
        "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/warehouse.png",
      title: "Warehouse Operations",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: false,
      description:
        "Knowledge related to the operation and management of warehouses, ensuring the efficient storage, handling, and movement of goods. This includes inventory control, order picking, packing, and organization of storage spaces.",
    },
    {
      id: "0a64c164-d333-49a0-bbe5-ff5ce30d5b0c",
      badge: "Top Logistics Skills",
      image:
        "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/green-logistics.png",
      title: "Sustainability & Green Logistics",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: false,
      description:
        "Knowledge of best practices that minimize the environmental impact of logistics activities. This includes reducing carbon emissions, optimizing transportation routes, using sustainable packaging, and promoting recycling.",
    },
    {
      id: "61477099-485f-4072-83a8-f4b7508ce086",
      badge: "Trending in Logistics",
      image:
        "https://tirwin-media-storage.s3.us-east-1.amazonaws.com/static-images/logistics.png",
      title: "Logistics Technology & Innovation",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      redirect: false,
      description:
        "Knowledge related to the application of advanced technologies and innovative solutions to improve logistics processes, such as automation, artificial intelligence, the Internet of Things (IoT), blockchain, and data analytics.",
    },
  ];

  navigateToLogistics(item:any) {
      if(item?.redirect) {
        if(item?.title === 'Logistics') {
          this.router.navigate(['/webinar/events'], { queryParams: { type: 'logistics' } });
        }
        else {
          this.router.navigate(['/webinar/masterclass'], { queryParams: { type: 'freight-cargo-management' } });          
        }
      }
  }

  navigateToTrainerRegistration(event: Event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/auth/trainer-registration']);
  }
}