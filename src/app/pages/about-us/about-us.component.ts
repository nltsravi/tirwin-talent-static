import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {
  
  ngOnInit() {
    console.log('AboutUsComponent loaded successfully!');
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
