import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.user_type !== 'admin') {
        this.router.navigate(['/auth/login']);
        return false;
      }
      return true;
    } catch (e) {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
} 