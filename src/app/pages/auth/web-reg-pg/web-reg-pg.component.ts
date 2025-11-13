import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { PaymentService } from '../payment.service';
import { ToastrService } from 'ngx-toastr';

interface WebinarData {
  title: string;
  tagline: string;
  priceINR: number;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

interface WebRegFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isWhatsappNumber: boolean;
}

@Component({
  selector: 'app-web-reg-pg',
  templateUrl: './web-reg-pg.component.html',
  styleUrls: ['./web-reg-pg.component.css']
})
export class WebRegPgComponent implements OnInit {
  submitted = false;
  isSubmitting = false;
  isPaymentProcessing = false;
  successMessage = '';
  errorMessage = '';

  paymentWindow: Window | null = null;
  iframeMonitorInterval: any = null;

  webinarData: WebinarData | null = null;

  private readonly fallbackData: WebinarData = {
    title: 'Launchpad to Logistics Leadership',
    tagline: 'Kickstart your journey in logistics, freight forwarding, and global trade with Tirwin!',
    priceINR: 99,
    date: '2025-11-21',
    startTime: '19:00',
    endTime: '21:00',
    timezone: 'Asia/Kolkata'
  };

  private readonly defaultJobTitle = 'Trainee';
  private readonly defaultCompany = 'To be filled';

  formData: WebRegFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isWhatsappNumber: true
  };

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private paymentService: PaymentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWebinarData();
  }

  private loadWebinarData(): void {
    this.http.get<WebinarData>('/assets/webinar_data.json', this.getNoCacheHttpOptions()).subscribe({
      next: (data) => {
        this.webinarData = data;
      },
      error: () => {
        this.webinarData = null;
      }
    });
  }

  private getNoCacheHttpOptions() {
    const noCacheHeaders = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    });

    return {
      headers: noCacheHeaders,
      params: { _ts: Date.now().toString() }
    };
  }

  private getActiveData(): WebinarData {
    return this.webinarData ?? this.fallbackData;
  }

  getHeroTitle(): string {
    return this.getActiveData().title;
  }

  getHeroSubtitle(): string {
    return this.getActiveData().tagline;
  }

  getHeroPrice(): string {
    return `₹${this.getActiveData().priceINR ?? 99}`;
  }

  getHeroDate(): string {
    const active = this.getActiveData();
    try {
      const date = new Date(active.date);
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return active.date;
    }
  }

  getHeroTimeRange(): string {
    const active = this.getActiveData();
    const start = this.formatTime(active.date, active.startTime);
    const end = this.formatTime(active.date, active.endTime);
    return `${start} - ${end} IST`;
  }

  private formatTime(dateStr: string, timeStr: string): string {
    if (!dateStr || !timeStr) {
      return 'TBD';
    }

    let date: Date;
    if (timeStr.includes('T')) {
      const parsed = new Date(timeStr);
      date = isNaN(parsed.getTime()) ? new Date(`${dateStr}T${timeStr}`) : parsed;
    } else {
      date = new Date(`${dateStr}T${timeStr}`);
    }

    if (isNaN(date.getTime())) {
      const [hours, minutes] = timeStr.split(':');
      date = new Date();
      date.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0);
    }

    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly before submitting the form.';
      return;
    }

    const payload = {
      first_name: this.formData.firstName?.trim(),
      last_name: this.formData.lastName?.trim(),
      email: this.formData.email?.trim(),
      phone: this.formData.phone?.trim(),
      job_title: this.defaultJobTitle,
      company: this.defaultCompany,
      additional_info: {
        isWhatsappNumber: this.formData.isWhatsappNumber
      },
      user_type: 'trainee',
      is_verified: false,
      is_first_time_login: true,
      subscriptionId: '06fff7d5-00b6-4679-afd8-d3dd4ae3beda',
      is_active: true
    };

    this.isSubmitting = true;

    this.authService.registerWebinarWithUser(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitted = true;
        this.successMessage = 'Thank you! Your webinar registration has been received. We will reach out shortly.';
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Something went wrong while submitting the registration. Please try again later.';
      }
    });
  }

  onPayNow(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.errorMessage = 'Please fill in all required fields correctly before proceeding to payment.';
      return;
    }

    const amountValue = this.getActiveData().priceINR || 0;
    const amountInteger = Math.floor(amountValue);

    const paymentRequest = {
      amount: amountInteger,
      currencyCode: '356',
      customerEmailID: this.formData.email?.trim(),
      customerMobileNo: this.formData.phone?.trim(),
      payType: '0'
    };

    this.isPaymentProcessing = true;

    this.paymentService.initiatePayment(paymentRequest).subscribe({
      next: (response: any) => {
        if (response && response.redirectUrl) {
          const windowFeatures = 'width=400,height=600,left=100,top=100,resizable=yes,scrollbars=yes';
          this.paymentWindow = window.open(response.redirectUrl, 'PaymentGateway', windowFeatures);

          this.isPaymentProcessing = false;
          this.toastr.success('Redirecting to payment gateway...');
        } else {
          this.toastr.error('Failed to get payment redirect URL');
          this.isPaymentProcessing = false;
        }
      },
      error: (error: any) => {
        console.error('Payment initiation error:', error);
        this.toastr.error(error?.error?.message || 'Failed to initiate payment. Please try again.');
        this.isPaymentProcessing = false;
      }
    });
  }
}
