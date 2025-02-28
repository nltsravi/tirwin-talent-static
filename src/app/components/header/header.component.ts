import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = "";
  activeLink: string = "";

  setActive(link: string) {
    this.activeLink = link;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Listen for auth state changes
    this.authService.getAuthState().subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
      this.loadUserData();
      this.cdr.detectChanges(); // **Force UI update**
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
      window.location.reload(); // **Force page reload**
    });
  }
}