import { Component, OnInit } from '@angular/core';
import { TraineeRegisterService } from '../auth/trainee-register/trainee-register.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reg-min',
    templateUrl: './reg-min.component.html',
    styleUrls: ['./reg-min.component.css']
})
export class RegMinComponent implements OnInit {

    registrationData = {
        firstName: '',
        lastName: '',
        mobile: '',
        email: ''
    };

    isRegistrationSuccess: boolean = false;

    constructor(
        private traineeRegisterService: TraineeRegisterService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        window.scrollTo(0, 0);
    }

    submit() {
        const payload = {
            ...this.registrationData,
            first_name: this.registrationData.firstName,
            last_name: this.registrationData.lastName,
            jobTitle: "Yet to be Filled",
            company: "Yet to be Filled",
            user_type: 'trainee',
            subscriptionId: '06fff7d5-00b6-4679-afd8-d3dd4ae3beda',
            is_active: true,
            is_verified: false,
            is_first_time_login: true
        };
        console.log('Sending Registration Payload:', payload);

        this.traineeRegisterService.registerUser(payload).subscribe({
            next: (response) => {
                this.router.navigate(['/reg-info'], {
                    state: {
                        message: 'Registration successful! Thank you for your interest. We will contact you with more info soon.',
                        type: 'success'
                    }
                });
            },
            error: (error) => {
                console.error('Registration error:', error);
                if (error.status === 409 || (error.error && error.error.message && error.error.message.toLowerCase().includes('already exist'))) {
                    this.router.navigate(['/reg-info'], {
                        state: {
                            message: 'your details are already with us. we will inform about our new webinars',
                            type: 'info'
                        }
                    });
                } else {
                    this.toastr.error('Registration failed. Please try again.');
                }
            }
        });
    }
}
