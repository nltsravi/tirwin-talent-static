import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leadership',
  templateUrl: './leadership.component.html',
  styleUrl: './leadership.component.css'
})
export class LeadershipComponent implements OnInit {
  
  ngOnInit() {
    console.log('LeadershipComponent loaded successfully!');
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
