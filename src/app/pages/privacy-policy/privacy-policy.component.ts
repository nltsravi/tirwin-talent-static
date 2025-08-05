import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent implements OnInit {
  
  ngOnInit() {
    console.log('PrivacyPolicyComponent loaded successfully!');
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
} 