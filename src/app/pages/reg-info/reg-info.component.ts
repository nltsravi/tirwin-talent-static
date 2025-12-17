import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reg-info',
    templateUrl: './reg-info.component.html',
    styleUrls: ['./reg-info.component.css']
})
export class RegInfoComponent implements OnInit {
    message: string = '';
    type: string = 'info'; // 'success' | 'info' | 'error'

    constructor(private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { message: string, type: string };

        if (state) {
            this.message = state.message;
            this.type = state.type || 'info';
        }
    }

    ngOnInit(): void {
        if (!this.message) {
            // Fallback or redirect if accessed directly without state
            this.message = 'Welcome to Tirwin Talent.';
        }
    }

    goHome() {
        this.router.navigate(['/home']);
    }
}
