import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  currentIndex = 0;
  /*testimonials = [
    { text: 'John is an amazing instructor, his insights into logistics are truly valuable!', author: 'Alice Smith' },
    { text: 'The webinar was well-structured and engaging. Highly recommend!', author: 'Mark Johnson' }
  ]*/
  testimonials=[
    {text: 'Coming soon', author:''}
  ]
  ngOnInit(): void {
    // Auto-slide every 5 seconds
    setInterval(() => {
      this.nextSlide();
    }, 5000);
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
      badge: "Trending in Logistics",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyO2XaEMc4sgXZa1fqNe3GrV45TFB_n_dolg&s",
      title: "Supply Chain Management",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      description:
        "Master the key principles of supply chain optimization to drive efficiency.",
    },
    {
      badge: "New Logistics Skills",
      image:
        "https://cdn.prod.website-files.com/647888ca92d03e3fca3f1ea0/647888ca92d03e3fca3f21e6_shutterstock_1024749010.png",
      title: "Warehouse Operations",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      description:
        "Learn how to effectively manage warehouse logistics and inventory tracking.",
    },
    {
      badge: "Build Your Career",
      image:
        "https://imageio.forbes.com/specials-images/imageserve/61014981d2dd2061a156bba9/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
      title: "Freight and Transport Management",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      description:
        "Understand freight management, global logistics, and transport systems.",
    },
    {
      badge: "Top Logistics Skills",
      image:
        "https://blog.imec.org/hubfs/63bbca2d280184a6813575fa_Inventory-Management.jpg",
      title: "Inventory Management",
      logo: "assets/images/logistics-logo.png",
      provider: "Global Logistics Academy",
      type: "Professional Certificate",
      description:
        "Develop skills in inventory tracking, forecasting, and order fulfillment.",
    },
  ];
}