import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent implements OnInit {
  showSlider = false; // Hide slider by default
  showAccount = false

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Check initial route data on component load
    this.updateSliderVisibility();
    
    // Listen for navigation events to update slider visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSliderVisibility();
    });
  }

  private updateSliderVisibility() {
    const currentRoute = this.route.snapshot.firstChild;
    // Only show slider if explicitly set to true (home page only)
    this.showSlider = currentRoute?.data['showSlider'] === true;
    this.showAccount = currentRoute?.data['account'] !== false;
  }
}
