import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing-policy',
  templateUrl: './pricing-policy.component.html',
  styleUrl: './pricing-policy.component.css'
})
export class PricingPolicyComponent implements OnInit {
  
  ngOnInit() {
    console.log('PricingPolicyComponent loaded successfully!');
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
} 