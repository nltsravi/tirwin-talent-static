import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {
  static showSlider = false; // Used by layout to hide hero banner
  selectedUserMenu: string = 'trainer';
  trainers: any[] = [];
  trainees: any[] = [];
  adminUsers: any[] = [];
  loading: boolean = false;
  error: string = '';
  approvingTrainers: { [key: string]: boolean } = {};
  currentPage: number = 1;
  pageSize: number = 50;
  totalItems: number = 0;
  totalPages: number = 0;
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedTrainerFilter: 'all' | 'approved' | 'pending' = 'pending';

  constructor(private http: HttpClient, private titleService: Title, private toastr: ToastrService, private router: Router) {
    this.titleService.setTitle('Admin - User Management');
  }

  ngOnInit(): void {
    // Check if user is admin
    const userStr = sessionStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/auth/login']);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.user_type !== 'admin') {
        this.router.navigate(['/auth/login']);
        return;
      }
    } catch (e) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.selectUserMenu('trainer');
  }

  selectUserMenu(menu: string) {
    this.selectedUserMenu = menu;
    this.currentPage = 1;
    if (menu === 'trainer') {
      this.fetchTrainers();
    } else if (menu === 'trainee') {
      this.fetchTrainees();
    } else if (menu === 'admin') {
      this.fetchAdminUsers();
    }
  }

  onTrainerFilterChange(filter: 'all' | 'approved' | 'pending') {
    this.selectedTrainerFilter = filter;
    this.fetchTrainers();
  }

  fetchTrainers() {
    this.loading = true;
    this.error = '';
    let params = new HttpParams();
    
    if (this.selectedTrainerFilter === 'approved') {
      params = params.set('isVerified', 'true');
    } else if (this.selectedTrainerFilter === 'pending') {
      params = params.set('isVerified', 'false');
    }

    this.http.get<any[]>(`${environment.api}/admin/users/by-type`, {
      params: params.set('userType', 'trainer')
    }).subscribe({
      next: (data) => {
        this.trainers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load trainers.';
        this.loading = false;
        console.error('API error:', err);
      }
    });
  }

  fetchTrainees() {
    this.loading = true;
    this.error = '';
    this.http.get<any>(`${environment.api}/admin/users/by-type?userType=trainee&isVerified=true&page=${this.currentPage}&limit=${this.pageSize}`)
      .subscribe({
        next: (response) => {
          this.trainees = response || [];
          this.totalItems = response.total || 0;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load trainees.';
          this.loading = false;
          console.error('API error:', err);
        }
      });
  }

  fetchAdminUsers() {
    this.loading = true;
    this.error = '';
    this.http.get<any>(`${environment.api}/admin/users/by-type?userType=admin&isVerified=true&page=${this.currentPage}&limit=${this.pageSize}`)
      .subscribe({
        next: (response) => {
          this.adminUsers = response || [];
          this.totalItems = response.total || 0;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load admin users.';
          this.loading = false;
          console.error('API error:', err);
        }
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.selectedUserMenu === 'trainer') {
      this.fetchTrainers();
    } else if (this.selectedUserMenu === 'trainee') {
      this.fetchTrainees();
    } else if (this.selectedUserMenu === 'admin') {
      this.fetchAdminUsers();
    }
  }

  onViewTrainer(trainer: any) {
    console.log('View trainer:', trainer);
    // Implement view logic here
  }

  onApproveTrainer(trainer: any) {
    if (!trainer.trainer.id) return;
    this.approvingTrainers[trainer.trainer.id] = true;
    this.http.patch(`${environment.api}/users/trainer/${trainer.trainer.id}/verify-profile`, {}).subscribe({
      next: () => {
        this.approvingTrainers[trainer.trainer.id] = false;
        // Remove the approved trainer from the list
        this.trainers = this.trainers.filter(t => t.trainer.id !== trainer.trainer.id);
        // Show success toast
        this.toastr.success('Trainer approved successfully!', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true
        });
      },
      error: (error) => {
        this.approvingTrainers[trainer.trainer.id] = false;
        this.error = error.error.message || 'Failed to approve trainer.';
        this.toastr.error(this.error, 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true
        });
      }
    });
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const items = this.selectedUserMenu === 'trainer' ? this.trainers :
                 this.selectedUserMenu === 'trainee' ? this.trainees :
                 this.adminUsers;

    items.sort((a, b) => {
      let valueA = column === 'name' ? 
        `${a.first_name} ${a.last_name}`.toLowerCase() : 
        a[column].toLowerCase();
      let valueB = column === 'name' ? 
        `${b.first_name} ${b.last_name}`.toLowerCase() : 
        b[column].toLowerCase();

      if (this.sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }
} 