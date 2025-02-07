// src/app/components/course-details/course-details.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {
  course = {
    title: 'Mastering Logistics: Strategies for a Seamless Supply Chain',
    shortDescription: 'Learn advanced logistics and supply chain management strategies to optimize efficiency and reduce costs.',
    tags: ['Logistics', 'Supply Chain', 'Operations'],
    categories: ['Business', 'Operations', 'Management'],
    createdBy: 'Jane Smith',
    updatedBy: 'John Doe',
    lastUpdated: 'February 2025',
    longDescription: 'This course covers advanced logistics concepts, focusing on real-world applications of supply chain optimization, warehouse management, and transportation logistics. Learn how to streamline operations and improve customer satisfaction while reducing operational costs.',
    whatYouWillLearn: [
      'Understand the fundamentals of supply chain management.',
      'Implement cost-effective logistics strategies.',
      'Optimize warehouse and inventory management systems.',
      'Improve transportation logistics to ensure timely delivery.',
      'Utilize data analytics for better decision-making in logistics.',
      'Address challenges in global supply chain operations.'
    ],
    trainer: {
      name: 'Michael Brown',
      photo: 'https://source.unsplash.com/200x200/?person,trainer',
      bio: 'Michael Brown is a seasoned logistics expert with over 20 years of experience in managing global supply chains and optimizing operational efficiency.'
    },
    thumbnail: 'https://source.unsplash.com/400x300/?logistics,warehouse',
    price: 99.99,
    originalPrice: 199.99,
    discount: 50,
    couponCode: 'LOGI50',
    additionalInfo: [
      'Duration: 30 hours of on-demand video',
      'Certificate of Completion included',
      'Access on mobile and TV'
    ]
  };
}