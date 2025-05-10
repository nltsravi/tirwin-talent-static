import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {
  static showSlider = false; // Used by layout to hide hero banner
  selectedUserMenu: string = 'trainer';
  trainers: any[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient, private titleService: Title) {
    this.titleService.setTitle('Admin - User Management');
  }

  ngOnInit(): void {
    this.selectUserMenu('trainer');
  }

  selectUserMenu(menu: string) {
    this.selectedUserMenu = menu;
    if (menu === 'trainer') {
      this.fetchTrainers();
    }
    // Add logic for other menus as needed
  }

  fetchTrainers() {
    this.loading = true;
    this.error = '';
    this.http.get<any[]>(`${environment.api}/admin/users/by-type?userType=trainer&isVerified=false`).subscribe({
      next: (data) => {
        console.log('API response:', data);
        this.trainers = data;
        console.log('Trainers set:', this.trainers);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load trainers.';
        this.loading = false;
        console.error('API error:', err);
      }
    });
  }

  onViewTrainer(trainer: any) {
    console.log('View trainer:', trainer);
    // Implement view logic here
  }

  onApproveTrainer(trainer: any) {
    console.log('Approve trainer:', trainer);
    // Implement approve logic here
  }
} 