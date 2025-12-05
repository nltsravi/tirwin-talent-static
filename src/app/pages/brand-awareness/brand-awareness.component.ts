import { Component } from '@angular/core';
import brandAwarenessData from '../../../assets/brand-awareness.json';

@Component({
  selector: 'app-brand-awareness',
  templateUrl: './brand-awareness.component.html',
  styleUrls: ['./brand-awareness.component.css']
})
export class BrandAwarenessComponent {
  data = brandAwarenessData;

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
