import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trainer-profile',
  templateUrl: './trainer-profile.component.html',
  styleUrls: ['./trainer-profile.component.css']
})
export class TrainerProfileComponent implements OnInit {
  trainer = {
    name: 'John Doe',
    jobTitle: 'Logistics Expert',
    company: 'Global Logistics Inc.',
    bio: 'A highly skilled and experienced trainer specializing in supply chain management and logistics, with over a decade of expertise in optimizing transportation networks, inventory management, and distribution strategies. Adept at delivering in-depth training sessions on freight management, warehouse operations, and global supply chain best practices, helping professionals and businesses streamline operations and enhance efficiency.',
    image: 'https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg',
    followers: 3500,
    totalWebinars: 15,
    rating: 4.5,
    linkedin: 'https://linkedin.com/in/johndoe',
    website: 'https://johndoe.com',
    email: 'johndoe@example.com',
    phone: '+1 234 567 890',
    webinars: [
      { title: 'Fleet Optimization Strategies', date: 'March 12, 2025', time: '3:00 PM EST', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyO2XaEMc4sgXZa1fqNe3GrV45TFB_n_dolg&s' },
      { title: 'Cold Chain Logistics Best Practices', date: 'April 5, 2025', time: '2:00 PM EST', image: 'https://cdn.prod.website-files.com/647888ca92d03e3fca3f1ea0/647888ca92d03e3fca3f21e6_shutterstock_1024749010.png' }
    ],
    pastWebinars: [
      { title: 'Fleet Optimization Strategies', date: 'March 12, 2025', time: '3:00 PM EST', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyO2XaEMc4sgXZa1fqNe3GrV45TFB_n_dolg&s' },
      { title: 'Cold Chain Logistics Best Practices', date: 'April 5, 2025', time: '2:00 PM EST', image: 'https://cdn.prod.website-files.com/647888ca92d03e3fca3f1ea0/647888ca92d03e3fca3f21e6_shutterstock_1024749010.png' }
    ],
    testimonials: [
      { text: 'John is an amazing instructor, his insights into logistics are truly valuable!', author: 'Alice Smith' },
      { text: 'The webinar was well-structured and engaging. Highly recommend!', author: 'Mark Johnson' }
    ]
  };

  starsArray = [1, 2, 3, 4, 5];
  currentIndex = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const trainerId = this.route.snapshot.paramMap.get('id');
    console.log('Trainer ID:', trainerId);

    // Auto-slide every 5 seconds
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.trainer.testimonials.length - 1 : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.trainer.testimonials.length;
  }
}