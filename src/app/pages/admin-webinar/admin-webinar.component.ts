import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-webinar',
  templateUrl: './admin-webinar.component.html',
  styleUrls: ['./admin-webinar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule]
})
export class AdminWebinarComponent implements OnInit, OnDestroy {
  static showSlider = false;
  selectedWebinarMenu: string = 'all';
  upcomingWebinars: any[] = [];
  pastWebinars: any[] = [];
  allWebinars: any[] = [];
  loading: boolean = false;
  error: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalItems: number = 0;
  totalPages: number = 0;
  sortColumn: string = 'title';
  sortDirection: 'asc' | 'desc' = 'asc';
  webinarForm!: FormGroup;
  bannerFile: File | null = null;
  bannerPreview: string | null = null;
  typeOptions: string[] = [];
  sessionTypeOptions: string[] = [];
  categoryOptions: any[] = [];
  subcategoryOptions: any[] = [];
  trainersOptions: any[] = [];
  trainerSearch: string = '';
  showTrainerDropdown: boolean = false;
  showCancelModal = false;
  showSaveModal = false;
  resumeUrl: string | null = null;

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.titleService.setTitle('Admin - Webinar Management');
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

    this.selectWebinarMenu('all');
    this.initForm();
    this.fetchWebinarTypes();
    this.fetchSessionTypes();
    this.fetchCategories();
    this.fetchTrainers();
    this.webinarForm.get('category')?.valueChanges.subscribe((cat) => {
      this.webinarForm.get('subcategory')?.setValue('');
      if (cat && (cat.subcategories || cat.children)) {
        this.subcategoryOptions = cat.subcategories || cat.children || [];
      } else {
        this.subcategoryOptions = [];
      }
    });
    document.addEventListener('click', this.handleClickOutsideDropdown.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutsideDropdown.bind(this));
  }

  public initForm() {
    this.webinarForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      session_type: ['', Validators.required],
      category: [''],
      subcategory: [''],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      trainers: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      meeting_link: [''],
      tags: [''],
      description: ['', Validators.required],
      session_description: ['', Validators.required],
    });
  }

  public onBannerChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.bannerFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.bannerPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  public onCancel() {
    this.router.navigate(['/admin/webinar-management']);
  }

  public onSaveDraft() {
    if (!this.webinarForm.dirty) {
      this.toastr.info('No changes to save.');
      return;
    }
    // Simulate saving draft (could POST to /draft endpoint)
    this.toastr.success('Webinar draft saved!');
  }

  async onSubmit() {
    if (this.webinarForm.invalid) {
      this.webinarForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields.');
      return;
    }
    const formValue = this.webinarForm.value;
    const trainers = formValue.trainers || [];
    if (!trainers.length) {
      this.toastr.error('At least one trainer must be selected.');
      return;
    }
    const trainerIds = trainers.map((t: any) => t.trainer_id);
    const trainerId = trainerIds[0];
    if (!trainerId) {
      this.toastr.error('Trainer ID is missing.');
      return;
    }
    const reqBody: any = {
      title: formValue.title,
      description: formValue.description,
      type: typeof formValue.type === 'object' ? (formValue.type.name || formValue.type.label || formValue.type.id || formValue.type) : formValue.type,
      session_type: typeof formValue.session_type === 'object' ? (formValue.session_type.name || formValue.session_type.label || formValue.session_type.id || formValue.session_type) : formValue.session_type,
      session_description: formValue.session_description,
      start_time: formValue.start_time,
      end_time: formValue.end_time,
      price: formValue.price,
      category_id: formValue.category?.id || formValue.category?._id || formValue.category || '',
      subcategory_id: formValue.subcategory?.id || formValue.subcategory?._id || formValue.subcategory || '',
      trainer_ids: trainerIds,
      trainer_id: trainerId,
      tags: (formValue.tags || '').split(',').map((t: string) => t.trim()).filter((t: string) => t),
      is_paid: formValue.price > 0,
      is_active: true,
      additional_info: {}
    };
    if (this.resumeUrl) {
      reqBody.documents = { resume: this.resumeUrl };
    }
    try {
      await this.http.post(`${environment.api}/admin/webinars`, reqBody).toPromise();
      this.toastr.success('Webinar created successfully!');
      this.router.navigate(['/admin/webinar-management']);
    } catch (err: any) {
      this.toastr.error('Failed to create webinar.');
    }
  }

  selectWebinarMenu(menu: string) {
    this.selectedWebinarMenu = menu;
    this.currentPage = 1;
    if (menu === 'all') {
      window.scrollTo(0, 0);
      this.router.navigate(['/admin/webinar-management']);
      this.fetchAllWebinars();
    } else if (menu === 'upcoming') {
      this.fetchUpcomingWebinars();
    } else if (menu === 'past') {
      this.fetchPastWebinars();
    }
  }

  fetchAllWebinars() {
    this.loading = true;
    this.error = '';
    this.http.get<any>(`${environment.api}/admin/webinars?page=${this.currentPage}&limit=${this.pageSize}`)
      .subscribe({
        next: (response) => {
          let webinars = response || [];
          webinars = webinars.sort((a: any, b: any) => {
            const aUpcoming = this.isUpcoming(a.end_time) ? 1 : 0;
            const bUpcoming = this.isUpcoming(b.end_time) ? 1 : 0;
            if (aUpcoming !== bUpcoming) return bUpcoming - aUpcoming;
            return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
          });
          this.allWebinars = webinars;
          this.totalItems = webinars.length || 0;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load webinars.';
          this.loading = false;
          console.error('API error:', err);
        }
      });
  }

  fetchUpcomingWebinars() {
    this.loading = true;
    this.error = '';
    this.http.get<any>(`${environment.api}/admin/webinars/upcoming?page=${this.currentPage}&limit=${this.pageSize}`)
      .subscribe({
        next: (response) => {
          this.upcomingWebinars = response.data || [];
          this.totalItems = response.total || 0;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load upcoming webinars.';
          this.loading = false;
          console.error('API error:', err);
        }
      });
  }

  fetchPastWebinars() {
    this.loading = true;
    this.error = '';
    this.http.get<any>(`${environment.api}/admin/webinars/past?page=${this.currentPage}&limit=${this.pageSize}`)
      .subscribe({
        next: (response) => {
          this.pastWebinars = response.data || [];
          this.totalItems = response.total || 0;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load past webinars.';
          this.loading = false;
          console.error('API error:', err);
        }
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.selectedWebinarMenu === 'upcoming') {
      this.fetchUpcomingWebinars();
    } else if (this.selectedWebinarMenu === 'past') {
      this.fetchPastWebinars();
    } else if (this.selectedWebinarMenu === 'all') {
      this.fetchAllWebinars();
    }
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const items = this.selectedWebinarMenu === 'upcoming' ? this.upcomingWebinars : 
                 this.selectedWebinarMenu === 'past' ? this.pastWebinars : 
                 this.allWebinars;

    items.sort((a, b) => {
      let valueA = a[column].toLowerCase();
      let valueB = b[column].toLowerCase();

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

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date not set';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Date not set';
    }
  }

  isUpcoming(date: string): boolean {
    try {
      const webinarDate = new Date(date);
      if (isNaN(webinarDate.getTime())) {
        return false;
      }
      return webinarDate > new Date();
    } catch (e) {
      return false;
    }
  }

  getWebinarStatus(date: string): string {
    try {
      const webinarDate = new Date(date);
      if (isNaN(webinarDate.getTime())) {
        return 'Date not set';
      }
      return this.isUpcoming(date) ? 'Upcoming' : 'Completed';
    } catch (e) {
      return 'Date not set';
    }
  }

  getStatusClass(date: string): string {
    try {
      const webinarDate = new Date(date);
      if (isNaN(webinarDate.getTime())) {
        return 'pending';
      }
      return this.isUpcoming(date) ? 'upcoming' : 'completed';
    } catch (e) {
      return 'pending';
    }
  }

  canShowRecording(date: string, recordingUrl: string): boolean {
    try {
      const webinarDate = new Date(date);
      if (isNaN(webinarDate.getTime())) {
        return false;
      }
      return !this.isUpcoming(date) && !!recordingUrl;
    } catch (e) {
      return false;
    }
  }

  truncateTitle(title: string): string {
    const words = title.split(' ');
    if (words.length > 5) {
      return words.slice(0, 5).join(' ') + '...';
    }
    return title;
  }

  isCreateRoute(): boolean {
    return this.router.url.endsWith('/admin/webinar-management/create');
  }

  fetchWebinarTypes() {
    this.http.get<any>(`${environment.api}/admin/webinar-types`).subscribe({
      next: (res) => {
        this.typeOptions = Array.isArray(res) ? res : (res.data || []);
      },
      error: () => {
        this.toastr.error('Failed to load webinar types');
      }
    });
  }

  fetchSessionTypes() {
    this.http.get<any>(`${environment.api}/admin/session-types`).subscribe({
      next: (res) => {
        this.sessionTypeOptions = Array.isArray(res) ? res : (res.data || []);
      },
      error: () => {
        this.toastr.error('Failed to load session types');
      }
    });
  }

  fetchCategories() {
    this.http.get<any>(`${environment.api}/categories/master/category`).subscribe({
      next: (res) => {
        this.categoryOptions = Array.isArray(res) ? res : (res.data || []);
      },
      error: () => {
        this.toastr.error('Failed to load categories');
      }
    });
  }

  fetchTrainers() {
    this.http.get<any>(`${environment.api}/admin/users/trainers`).subscribe({
      next: (res) => {
        this.trainersOptions = Array.isArray(res) ? res : (res.data || []);
      },
      error: () => {
        this.toastr.error('Failed to load trainers');
      }
    });
  }

  public isString(val: any): boolean {
    return typeof val === 'string';
  }

  public getOptionLabel(option: any): string {
    if (typeof option === 'string') return option;
    if (option && typeof option === 'object') return option.name || option.label || '';
    return '';
  }

  filteredTrainers(): any[] {
    const search = this.trainerSearch?.toLowerCase() || '';
    return this.trainersOptions.filter(trainer => {
      const name = (trainer.name || (trainer.user?.first_name + ' ' + trainer.user?.last_name) || '').toLowerCase();
      const email = (trainer.email || trainer.user?.email || '').toLowerCase();
      return name.includes(search) || email.includes(search);
    });
  }

  toggleTrainer(trainer: any) {
    const selected = this.webinarForm.get('trainers')?.value || [];
    const idx = selected.findIndex((t: any) => (t.id || t._id) === (trainer.id || trainer._id));
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(trainer);
    }
    this.webinarForm.get('trainers')?.setValue([...selected]);
    this.showTrainerDropdown = true;
  }

  isTrainerSelected(trainer: any): boolean {
    const selected = this.webinarForm.get('trainers')?.value || [];
    return selected.some((t: any) => (t.id || t._id) === (trainer.id || trainer._id));
  }

  removeTrainer(trainer: any) {
    const selected = this.webinarForm.get('trainers')?.value || [];
    const idx = selected.findIndex((t: any) => (t.id || t._id) === (trainer.id || trainer._id));
    if (idx > -1) {
      selected.splice(idx, 1);
      this.webinarForm.get('trainers')?.setValue([...selected]);
    }
  }

  handleClickOutsideDropdown(event: MouseEvent) {
    const dropdown = document.querySelector('.custom-multiselect');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.showTrainerDropdown = false;
    }
  }

  public getTrainerName(trainer: any): string {
    if (!trainer) return '';
    if (trainer.name) return trainer.name;
    if (trainer) {
      const first = trainer.first_name || '';
      const last = trainer.last_name || '';
      return (first + ' ' + last).trim();
    }
    return '';
  }

  public getTrainerInitials(trainer: any): string {
    if (!trainer) return '';
    if (trainer.name) {
      const parts = trainer.name.split(' ');
      return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    }
    const first = trainer.first_name || trainer.user?.first_name || '';
    const last = trainer.last_name || trainer.user?.last_name || '';
    return (first[0] || '') + (last[0] || '');
  }

  public getTrainerFirstName(trainer: any): string {
    if (!trainer) return '';
    if (trainer.first_name) return trainer.first_name;
    if (trainer.user && trainer.user.first_name) return trainer.user.first_name;
    if (trainer.name) return trainer.name.split(' ')[0];
    return '';
  }

  onCancelClick() {
    if (confirm('All unsaved information will be discarded. Do you want to leave this page?')) {
      this.router.navigate(['/admin/webinar-management']);
    }
  }

  onSaveClick() {
    alert('The Save Draft feature is coming soon.');
  }

  onEditClick() {
    alert('This feature is coming soon.');
  }
} 