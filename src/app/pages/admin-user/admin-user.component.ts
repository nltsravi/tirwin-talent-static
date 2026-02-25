import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  webinars: any[] = [];
  subscribers: any[] = [];
  selectedWebinar: any = null;
  loading: boolean = false;
  error: string = '';
  approvingTrainers: { [key: string]: boolean } = {};
  currentPage: number = 1;
  pageSize: number = 50;
  totalItems: number = 0;
  totalPages: number = 0;
  sortColumn: string = 'start_time';
  sortDirection: 'asc' | 'desc' = 'desc';
  selectedTrainerFilter: 'all' | 'approved' | 'pending' = 'pending';
  selectedUsers: { [key: string]: boolean } = {};
  sendingNotifications: { [key: string]: boolean } = {};

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

  getMenuTitle(): string {
    switch (this.selectedUserMenu) {
      case 'trainer': return 'Trainers';
      case 'trainee': return 'Trainees';
      case 'admin': return 'Admin Users';
      case 'webinar-subscriptions': return 'Webinar Subscriptions';
      default: return 'User Management';
    }
  }

  selectUserMenu(menu: string) {
    this.selectedUserMenu = menu;
    this.currentPage = 1;
    this.selectedWebinar = null;
    this.subscribers = [];

    if (menu === 'trainer') {
      this.fetchTrainers();
    } else if (menu === 'trainee') {
      this.fetchTrainees();
    } else if (menu === 'admin') {
      this.fetchAdminUsers();
    } else if (menu === 'webinar-subscriptions') {
      this.fetchWebinars();
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

    this.http.get<any[]>(`assets/api-data/trainers.json`).subscribe({
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
    this.http.get<any>(`assets/api-data/admin_enrolled_users.json`)
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
    this.http.get<any>(`assets/api-data/admin_enrolled_users.json`)
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

  fetchWebinars() {
    this.loading = true;
    this.error = '';
    this.http.get<any>(`assets/api-data/admin_webinars.json`).subscribe({
      next: (data) => {
        // Filter webinars with price greater than 0
        //this.webinars = (data || []).filter(webinar => webinar.price > 0);
        let arr = Array.isArray(data) ? data : (data.data || []);
        this.webinars = arr;

        // Sort by start date (newest first)
        this.webinars.sort((a, b) => {
          const dateA = new Date(a.start_time || 0);
          const dateB = new Date(b.start_time || 0);
          return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        });

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load webinars.';
        this.loading = false;
        console.error('API error:', err);
      }
    });
  }

  selectWebinar(webinar: any) {
    this.selectedWebinar = webinar;
    this.fetchSubscribers(webinar.id);
  }

  backToWebinars() {
    this.selectedWebinar = null;
    this.subscribers = [];
  }

  fetchSubscribers(webinarId: string) {
    this.loading = true;
    this.error = '';

    this.http.get<any>(`assets/api-data/admin_enrolled_users.json`).subscribe({
      next: (data) => {
        console.log('Enrolled users data received:', data);
        this.subscribers = Array.isArray(data) ? data : (data.enrolled_users || []);
        this.loading = false;

        // Log the first subscriber to see the structure
        if (this.subscribers.length > 0) {
          console.log('First subscriber structure:', this.subscribers[0]);
        } else {
          console.log('No enrolled users found for webinar:', webinarId);
          // For testing purposes, you can uncomment the following lines to see sample data
          // this.subscribers = this.getMockEnrolledUsers();
        }
      },
      error: (err) => {
        this.error = 'Failed to load enrolled users.';
        this.loading = false;
        console.error('API error:', err);
        console.error('API URL attempted:', `${environment.api}/admin/webinars/${webinarId}/enrolled-users`);
        this.toastr.error('Failed to load enrolled users. Please try again.', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true
        });
      }
    });
  }

  // Mock data for testing - uncomment in fetchSubscribers if needed
  private getMockEnrolledUsers(): any[] {
    return [
      {
        id: 1,
        user_name: 'John Doe',
        email_id: 'john.doe@example.com',
        created_at: '2024-01-15T10:30:00Z',
        transaction_id: 'TXN123456789'
      },
      {
        id: 2,
        user_name: 'Jane Smith',
        email_id: 'jane.smith@example.com',
        created_at: '2024-01-16T14:20:00Z',
        transaction_id: 'TXN987654321'
      },
      {
        id: 3,
        user_name: 'Bob Johnson',
        email_id: 'bob.johnson@example.com',
        created_at: '2024-01-17T09:15:00Z',
        transaction_id: 'TXN456789123'
      }
    ];
  }

  loadMockData() {
    this.subscribers = this.getMockEnrolledUsers();
    this.toastr.info('Loaded test data for demonstration purposes.', 'Test Data', {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }

  // Checkbox selection methods
  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;
    this.subscribers.forEach((subscriber, index) => {
      const key = subscriber.id || index.toString();
      this.selectedUsers[key] = isChecked;
    });
  }

  toggleUserSelection(subscriber: any, event: any) {
    const key = subscriber.id || this.subscribers.indexOf(subscriber).toString();
    this.selectedUsers[key] = event.target.checked;
  }

  isAllSelected(): boolean {
    if (this.subscribers.length === 0) return false;
    return this.subscribers.every((subscriber, index) => {
      const key = subscriber.id || index.toString();
      return this.selectedUsers[key];
    });
  }

  getSelectedCount(): number {
    return Object.values(this.selectedUsers).filter(selected => selected).length;
  }

  getSelectedUsers(): any[] {
    return this.subscribers.filter((subscriber, index) => {
      const key = subscriber.id || index.toString();
      return this.selectedUsers[key];
    });
  }

  // Email and notification methods
  sendEmailToSelected() {
    const selectedUsers = this.getSelectedUsers();
    if (selectedUsers.length === 0) {
      this.toastr.warning('Please select at least one user to send email.', 'Warning');
      return;
    }

    if (!this.selectedWebinar || !this.selectedWebinar.id) {
      this.toastr.error('No webinar selected.', 'Error');
      return;
    }

    const userIds = this.getUserIds(selectedUsers);
    if (userIds.length === 0) {
      this.toastr.error('No valid user IDs found for selected users.', 'Error');
      return;
    }

    const requestBody = {
      webinarId: this.selectedWebinar.id,
      userIds: userIds
    };

    console.log('Sending webinar meeting notification with payload:', requestBody);

    console.log('Simulated send email to selected:', requestBody);
    of({ status: 'success' })
      .subscribe({
        next: (response) => {
          console.log('Notification sent successfully:', response);
          this.toastr.success(`Webinar meeting notification sent to ${userIds.length} users successfully.`, 'Notification Sent', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
        },
        error: (error) => {
          console.error('Failed to send notification:', error);
          this.toastr.error('Failed to send webinar meeting notification. Please try again.', 'Error', {
            timeOut: 5000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
        }
      });
  }

  sendNotification(subscriber: any) {
    const key = subscriber.id || this.subscribers.indexOf(subscriber).toString();
    this.sendingNotifications[key] = true;

    const userName = this.getUserName(subscriber);
    const userEmail = this.getUserEmail(subscriber);

    if (!this.selectedWebinar || !this.selectedWebinar.id) {
      this.sendingNotifications[key] = false;
      this.toastr.error('No webinar selected.', 'Error');
      return;
    }

    const userId = this.getUserIds([subscriber])[0];
    if (!userId) {
      this.sendingNotifications[key] = false;
      this.toastr.error('No valid user ID found for this user.', 'Error');
      return;
    }

    const requestBody = {
      webinarId: this.selectedWebinar.id,
      userIds: [userId]
    };

    console.log('Sending individual notification with payload:', requestBody);

    console.log('Simulated send notification:', requestBody);
    of({ status: 'success' })
      .subscribe({
        next: (response) => {
          console.log('Individual notification sent successfully:', response);
          this.sendingNotifications[key] = false;
          this.toastr.success(`Notification sent to ${userName} (${userEmail})`, 'Notification Sent', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
        },
        error: (error) => {
          console.error('Failed to send individual notification:', error);
          this.sendingNotifications[key] = false;
          this.toastr.error('Failed to send notification. Please try again.', 'Error', {
            timeOut: 5000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
        }
      });
  }

  exportToExcel() {
    if (!this.selectedWebinar || this.subscribers.length === 0) {
      this.toastr.warning('No data available to export.', 'Export Warning');
      return;
    }

    try {
      // Prepare the data for export
      const exportData = this.subscribers.map((subscriber, index) => ({
        'S.No': index + 1,
        'User Name': this.getUserName(subscriber),
        'Email ID': this.getUserEmail(subscriber),
        'Registered Date': this.formatDate(this.getUserDate(subscriber)),
        'Transaction ID': this.getUserTransactionId(subscriber)
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 8 },   // S.No
        { wch: 25 },  // User Name
        { wch: 30 },  // Email ID
        { wch: 20 },  // Registered Date
        { wch: 25 }   // Transaction ID
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      const webinarTitle = this.selectedWebinar.title || 'Webinar';
      const safeTitle = webinarTitle.replace(/[^\w\s-]/g, '').substring(0, 31); // Excel sheet name limit
      XLSX.utils.book_append_sheet(workbook, worksheet, safeTitle);

      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `enrolled_users_${safeTitle}_${date}.xlsx`;

      // Convert to blob and download
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);

      this.toastr.success(`Exported ${this.subscribers.length} users to Excel file.`, 'Export Successful', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true
      });

    } catch (error) {
      console.error('Export error:', error);
      this.toastr.error('Failed to export data. Please try again.', 'Export Error');
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getWebinarStatus(webinar: any): string {
    if (!webinar.start_time) return 'Unknown';
    const now = new Date();
    const startTime = new Date(webinar.start_time);
    const endTime = webinar.end_time ? new Date(webinar.end_time) : null;

    if (endTime && now > endTime) {
      return 'Completed';
    } else if (now >= startTime && (!endTime || now <= endTime)) {
      return 'Live';
    } else if (now < startTime) {
      return 'Upcoming';
    }
    return 'Unknown';
  }

  getWebinarStatusClass(webinar: any): string {
    const status = this.getWebinarStatus(webinar);
    switch (status) {
      case 'Live': return 'live';
      case 'Completed': return 'completed';
      case 'Upcoming': return 'upcoming';
      default: return 'unknown';
    }
  }

  // Helper methods for enrolled users data
  getUserName(subscriber: any): string {
    if (subscriber.user_name) return subscriber.user_name;
    if (subscriber.user?.first_name && subscriber.user?.last_name) {
      return `${subscriber.user.first_name} ${subscriber.user.last_name}`;
    }
    if (subscriber.first_name && subscriber.last_name) {
      return `${subscriber.first_name} ${subscriber.last_name}`;
    }
    if (subscriber.name) return subscriber.name;
    return 'N/A';
  }

  getUserEmail(subscriber: any): string {
    if (subscriber.email_id) return subscriber.email_id;
    if (subscriber.user?.email) return subscriber.user.email;
    if (subscriber.email) return subscriber.email;
    return 'N/A';
  }

  getUserDate(subscriber: any): string {
    if (subscriber.subscription_date) return subscriber.subscription_date;
    return '';
  }

  getUserTransactionId(subscriber: any): string {
    if (subscriber.transaction_id) return subscriber.transaction_id;
    if (subscriber.transactionId) return subscriber.transactionId;
    if (subscriber.payment_id) return subscriber.payment_id;
    if (subscriber.paymentId) return subscriber.paymentId;
    return 'N/A';
  }

  getUserIds(selectedUsers: any[]): string[] {
    return selectedUsers.map(user => {
      // Try different possible user ID fields
      if (user.user_id) return user.user_id;
      if (user.userId) return user.userId;
      if (user.id) return user.id;
      if (user.user?.id) return user.user.id;
      return null;
    }).filter(id => id !== null);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.selectedUserMenu === 'trainer') {
      this.fetchTrainers();
    } else if (this.selectedUserMenu === 'trainee') {
      this.fetchTrainees();
    } else if (this.selectedUserMenu === 'admin') {
      this.fetchAdminUsers();
    } else if (this.selectedUserMenu === 'webinar-subscriptions') {
      this.fetchWebinars();
    }
  }

  onViewTrainer(trainer: any) {
    console.log('View trainer:', trainer);
    // Implement view logic here
  }

  onApproveTrainer(trainer: any) {
    if (!trainer.trainer.id) return;
    this.approvingTrainers[trainer.trainer.id] = true;
    console.log('Simulated approve trainer:', trainer.trainer.id);
    of({ status: 'success' }).subscribe({
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

    let items: any[];
    if (this.selectedUserMenu === 'webinar-subscriptions') {
      if (this.selectedWebinar) {
        items = this.subscribers;
      } else {
        items = this.webinars;
      }
    } else {
      items = this.selectedUserMenu === 'trainer' ? this.trainers :
        this.selectedUserMenu === 'trainee' ? this.trainees :
          this.adminUsers;
    }

    items.sort((a, b) => {
      let valueA: string, valueB: string;

      if (this.selectedUserMenu === 'webinar-subscriptions') {
        if (this.selectedWebinar) {
          // Handle enrolled user sorting
          if (column === 'name') {
            valueA = (a.user_name || `${a.first_name || ''} ${a.last_name || ''}`).toLowerCase();
            valueB = (b.user_name || `${b.first_name || ''} ${b.last_name || ''}`).toLowerCase();
          } else if (column === 'email') {
            valueA = (a.email_id || a.email || '').toLowerCase();
            valueB = (b.email_id || b.email || '').toLowerCase();
          } else if (column === 'created_at') {
            valueA = (a.created_at || a.created_at || '').toLowerCase();
            valueB = (b.created_at || b.created_at || '').toLowerCase();
          } else if (column === 'transaction_id') {
            valueA = (a.transaction_id || '').toLowerCase();
            valueB = (b.transaction_id || '').toLowerCase();
          } else {
            valueA = (a[column] || '').toString().toLowerCase();
            valueB = (b[column] || '').toString().toLowerCase();
          }
        } else {
          // Handle webinar sorting
          if (column === 'title') {
            valueA = (a.title || '').toLowerCase();
            valueB = (b.title || '').toLowerCase();
          } else if (column === 'type') {
            valueA = (a.type || '').toLowerCase();
            valueB = (b.type || '').toLowerCase();
          } else if (column === 'price') {
            valueA = (a.price || 0).toString();
            valueB = (b.price || 0).toString();
            // For numeric sorting
            if (this.sortDirection === 'asc') {
              return parseFloat(valueA) - parseFloat(valueB);
            } else {
              return parseFloat(valueB) - parseFloat(valueA);
            }
          } else if (column === 'start_time') {
            valueA = (a.start_time || '').toLowerCase();
            valueB = (b.start_time || '').toLowerCase();
          } else {
            valueA = (a[column] || '').toString().toLowerCase();
            valueB = (b[column] || '').toString().toLowerCase();
          }
        }
      } else {
        // Handle regular user sorting
        valueA = column === 'name' ?
          `${a.first_name} ${a.last_name}`.toLowerCase() :
          a[column].toLowerCase();
        valueB = column === 'name' ?
          `${b.first_name} ${b.last_name}`.toLowerCase() :
          b[column].toLowerCase();
      }

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