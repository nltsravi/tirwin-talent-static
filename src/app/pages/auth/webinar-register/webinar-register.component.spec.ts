import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { WebinarRegisterComponent } from './webinar-register.component';
import { AuthService } from '../auth.service';
import { PaymentService } from '../payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockAuthService {
  checkIfUserExists = jasmine.createSpy('checkIfUserExists');
  subscribeToWebinar = jasmine.createSpy('subscribeToWebinar');
  registerWebinarWithUser = jasmine.createSpy('registerWebinarWithUser');
}

class MockPaymentService {
  initiatePayment = jasmine.createSpy('initiatePayment');
  getWebinarDetails = jasmine.createSpy('getWebinarDetails');
  generatePaymentInfo = jasmine.createSpy('generatePaymentInfo');
}

class MockToastrService {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
  warning = jasmine.createSpy('warning');
}

describe('WebinarRegisterComponent', () => {
  let component: WebinarRegisterComponent;
  let fixture: ComponentFixture<WebinarRegisterComponent>;
  let authService: MockAuthService;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          if (key === 'webinarId') {
            return 'webinar-123';
          }
          if (key === 'webinarType') {
            return 'masterclass';
          }
          return null;
        }
      }
    },
    params: of({ webinarType: 'masterclass', webinarId: 'webinar-123' })
  } as unknown as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [WebinarRegisterComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: PaymentService, useClass: MockPaymentService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ToastrService, useClass: MockToastrService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WebinarRegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;

    component.webinarDetails = {
      id: 'webinar-123',
      price: '99'
    } as any;

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john@example.com';
    component.phone = '9876543210';
    component.jobTitle = 'Engineer';
    component.company = 'Example Corp';
    component.isEmailVerified = true;
    component.isOtpVerified = true;
  });

  it('should register an existing user and subscribe to webinar', fakeAsync(() => {
    component.userId = 'existing-user-id';
    const userExistsResponse = { exists: true, user: { id: 'existing-user-id' } };

    authService.checkIfUserExists.and.returnValue(of(userExistsResponse));
    authService.subscribeToWebinar.and.returnValue(of({ success: true }));

    component.completeRegistration();
    tick();

    expect(authService.checkIfUserExists).toHaveBeenCalledWith('john@example.com');
    expect(authService.subscribeToWebinar).toHaveBeenCalledWith(jasmine.objectContaining({
      webinarId: 'webinar-123',
      userId: 'existing-user-id'
    }));
    expect(component.showThankYouPage).toBeTrue();
    expect(component.isSubmitting).toBeFalse();
  }));

  it('should register a new user and then subscribe', fakeAsync(() => {
    const userExistsResponse = { exists: false };
    const registerResponse = { user: { id: 'new-user-id' } };

    authService.checkIfUserExists.and.returnValue(of(userExistsResponse));
    authService.registerWebinarWithUser.and.returnValue(of(registerResponse));
    authService.subscribeToWebinar.and.returnValue(of({ success: true }));

    component.completeRegistration();
    tick();

    expect(authService.checkIfUserExists).toHaveBeenCalledWith('john@example.com');
    expect(authService.registerWebinarWithUser).toHaveBeenCalledWith(jasmine.objectContaining({
      email: 'john@example.com'
    }));
    expect(authService.subscribeToWebinar).toHaveBeenCalledWith(jasmine.objectContaining({
      userId: 'new-user-id'
    }));
    expect(component.showThankYouPage).toBeTrue();
    expect(component.isSubmitting).toBeFalse();
  }));

  it('should handle subscribe error for existing user', fakeAsync(() => {
    const userExistsResponse = { exists: true, user: { id: 'existing-user-id' } };

    authService.checkIfUserExists.and.returnValue(of(userExistsResponse));
    authService.subscribeToWebinar.and.returnValue(throwError(() => ({ error: { message: 'Subscription failed' } })));

    component.completeRegistration();
    tick();

    expect(component.errorMessage).toBe('Subscription failed');
    expect(component.isSubmitting).toBeFalse();
    expect(component.showThankYouPage).toBeFalse();
  }));

  it('should handle registration error for new user', fakeAsync(() => {
    const userExistsResponse = { exists: false };

    authService.checkIfUserExists.and.returnValue(of(userExistsResponse));
    authService.registerWebinarWithUser.and.returnValue(throwError(() => ({ error: { message: 'Registration failed' } })));

    component.completeRegistration();
    tick();

    expect(component.errorMessage).toBe('Registration failed');
    expect(component.isSubmitting).toBeFalse();
    expect(component.showThankYouPage).toBeFalse();
  }));
});
