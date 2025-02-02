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
    bio: 'Experienced trainer in supply chain and logistics with 10+ years of expertise.',
    image: 'https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg',
    followers: 3500,
    totalWebinars: 15,
    rating: 4.5,
    linkedin: 'https://linkedin.com/in/johndoe',
    website: 'https://johndoe.com',
    email: 'johndoe@example.com',
    phone: '+1 234 567 890',
    webinars: [
      { title: 'Fleet Optimization Strategies', date: 'March 12, 2025', time: '3:00 PM EST', image: 'assets/images/webinars/webinar1.jpg' },
      { title: 'Cold Chain Logistics Best Practices', date: 'April 5, 2025', time: '2:00 PM EST', image: 'assets/images/webinars/webinar2.jpg' }
    ],
    testimonials: [
      { text: 'John is an amazing instructor, his insights into logistics are truly valuable!', author: 'Alice Smith' },
      { text: 'The webinar was well-structured and engaging. Highly recommend!', author: 'Mark Johnson' }
    ]
  };

  starsArray = [1, 2, 3, 4, 5]; // For rating stars

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const trainerId = this.route.snapshot.paramMap.get('id');
    console.log('Trainer ID:', trainerId);
  }

  courses = [
    {
      badge: 'Trending in Logistics',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyO2XaEMc4sgXZa1fqNe3GrV45TFB_n_dolg&s',
      title: 'Supply Chain Management',
      logo: 'assets/images/logistics-logo.png',
      provider: 'Global Logistics Academy',
      type: 'Professional Certificate',
      description: 'Master the key principles of supply chain optimization to drive efficiency.',
    },
    {
      badge: 'New Logistics Skills',
      image: 'https://cdn.prod.website-files.com/647888ca92d03e3fca3f1ea0/647888ca92d03e3fca3f21e6_shutterstock_1024749010.png',
      title: 'Warehouse Operations',
      logo: 'assets/images/logistics-logo.png',
      provider: 'Global Logistics Academy',
      type: 'Professional Certificate',
      description: 'Learn how to effectively manage warehouse logistics and inventory tracking.',
    },
    {
      badge: 'Build Your Career',
      image: 'https://imageio.forbes.com/specials-images/imageserve/61014981d2dd2061a156bba9/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds',
      title: 'Freight and Transport Management',
      logo: 'assets/images/logistics-logo.png',
      provider: 'Global Logistics Academy',
      type: 'Professional Certificate',
      description: 'Understand freight management, global logistics, and transport systems.',
    },
    {
      badge: 'Top Logistics Skills',
      image: 'https://blog.imec.org/hubfs/63bbca2d280184a6813575fa_Inventory-Management.jpg',
      title: 'Inventory Management',
      logo: 'assets/images/logistics-logo.png',
      provider: 'Global Logistics Academy',
      type: 'Professional Certificate',
      description: 'Develop skills in inventory tracking, forecasting, and order fulfillment.',
    },
  ];
}