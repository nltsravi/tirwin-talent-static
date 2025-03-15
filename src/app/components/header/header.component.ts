import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = "";
  currentUrl: string = "";
  isMobileMenuOpen: boolean = false;

  constructor(private router: Router, private authService: AuthService) { 
    this.isActive('/home')
  }

  ngOnInit() {
    this.authService.getAuthState().subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
      this.loadUserData();
    });

    // Track active route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  loadUserData() {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = `${user.first_name} ${user.last_name}`;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/auth/login"]).then(() => {
      window.location.reload(); // Force page reload
    });
  }

  isActive(path: string): boolean {
    console.log(`Checking active class for: ${path}, Current URL: ${this.currentUrl}`);
    return this.currentUrl === path;
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}