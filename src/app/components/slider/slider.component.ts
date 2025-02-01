// src/app/components/slider/slider.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent {
  slide = {
    title: 'Unlock limitless learning opportunities',
    description: 'Start, switch, or elevate your career with over 10,000 courses, professional certifications, and degrees from top universities and leading companies.',
    buttonText: 'Try Now →',
    buttonLink: '#',
    image: 'https://media.istockphoto.com/id/1443305526/photo/young-smiling-man-in-headphones-typing-on-laptop-keyboard.jpg?s=612x612&w=0&k=20&c=-JzAS5fjTvxyNRkYoaIlpoLfmt5AEIOcwpt6lk0D4TA='
  };
}
