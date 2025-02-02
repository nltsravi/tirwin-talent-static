import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-webinar-list',
  templateUrl: './webinar-list.component.html',
  styleUrls: ['./webinar-list.component.css']
})
export class WebinarListComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  categories = ['Logistics', 'Supply Chain', 'Freight Management', 'Warehousing'];

  webinars = [
    {
      title: 'Introduction to Supply Chain Management',
      description: 'Learn the fundamentals of supply chain logistics and its importance.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyO2XaEMc4sgXZa1fqNe3GrV45TFB_n_dolg&s',
      author: 'John Doe',
      date: 'March 10, 2025',
      time: '3:00 PM EST',
      category: 'Supply Chain',
      isNew: true
    },
    {
      title: 'Introduction to Supply Chain Management – Fundamentals of SCM & key principles',
      description: 'Best practices for warehouse management and efficiency.',
      image: 'https://cdn.prod.website-files.com/647888ca92d03e3fca3f1ea0/647888ca92d03e3fca3f21e6_shutterstock_1024749010.png',
      author: 'Jane Smith',
      date: 'March 15, 2025',
      time: '2:00 PM EST',
      category: 'Warehousing',
      isNew: false
    },
    {
      title: 'Freight Management Strategies',
      description: 'Understanding the Logistics Lifecycle – From procurement to last-mile delivery',
      image: 'https://imageio.forbes.com/specials-images/imageserve/61014981d2dd2061a156bba9/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds',
      author: 'Michael Johnson',
      date: 'March 20, 2025',
      time: '4:00 PM EST',
      category: 'Freight Management',
      isNew: true
    },
    {
      title: 'Top Logistics Skills',
      description: 'Warehouse Operations 101 – Best practices for inventory storage & handling',
      image: 'https://blog.imec.org/hubfs/63bbca2d280184a6813575fa_Inventory-Management.jpg',
      author: 'Michael Johnson',
      date: 'March 20, 2025',
      time: '4:00 PM EST',
      category: 'Top Logistics Skills',
      isNew: false
    }
  ];

  filteredWebinars = [...this.webinars];

  constructor() {}

  ngOnInit(): void {}

  filterWebinars() {
    this.filteredWebinars = this.webinars.filter(webinar => {
      const matchesSearch = webinar.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory ? webinar.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }
}