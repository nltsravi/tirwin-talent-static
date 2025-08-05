import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(private router: Router) {}

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToTermsAndConditions() {
    this.router.navigate(['/terms-conditions']);
    this.scrollToTop();
  }

  navigateToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
    this.scrollToTop();
  }

  navigateToPricingPolicy() {
    this.router.navigate(['/pricing-policy']);
    this.scrollToTop();
  }
}
