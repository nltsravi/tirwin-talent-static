import { Component, OnInit } from '@angular/core';
import brandAwarenessData from '../../../assets/brand-awareness.json';

@Component({
  selector: 'app-brand-awareness',
  templateUrl: './brand-awareness.component.html',
  styleUrls: ['./brand-awareness.component.css']
})
export class BrandAwarenessComponent implements OnInit {
  data = brandAwarenessData;

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  joinWaitlist(): void {
    window.location.href = `mailto:${this.data.contactInfo.email}?subject=Join Waiting List`;
  }
}
