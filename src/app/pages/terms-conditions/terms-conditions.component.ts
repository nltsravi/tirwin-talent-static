import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.css'
})
export class TermsConditionsComponent implements OnInit {
  
  ngOnInit() {
    console.log('TermsConditionsComponent loaded successfully!');
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
