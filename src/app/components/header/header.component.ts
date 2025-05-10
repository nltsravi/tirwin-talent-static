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
  isAdmin: boolean = false;
  isAdminMenuOpen: boolean = false;
  isAdminMobileMenuOpen: boolean = false;
  isAdminMenuHovered: boolean = false;
  isTrainerOrAdmin: boolean = false;

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
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = `${user.first_name} ${user.last_name}`;
      this.isAdmin = user.user_type === 'admin';
      this.isTrainerOrAdmin = user.user_type === 'admin' || user.user_type === 'trainer';
    } else {
      this.isAdmin = false;
      this.isTrainerOrAdmin = false;
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

  toggleAdminMenu() {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }

  toggleAdminMobileMenu() {
    this.isAdminMobileMenuOpen = !this.isAdminMobileMenuOpen;
  }

  onAdminMenuMouseEnter() {
    this.isAdminMenuHovered = true;
    this.isAdminMenuOpen = true;
  }

  onAdminMenuMouseLeave() {
    this.isAdminMenuHovered = false;
    setTimeout(() => {
      if (!this.isAdminMenuHovered) {
        this.isAdminMenuOpen = false;
      }
    }, 200); // Small delay to allow for submenu interaction
  }
}