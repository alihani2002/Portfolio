import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginDto } from '../services/auth.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {
  credentials: LoginDto = { email: '', password: '' };
  rememberMe = false;
  loading = false;
  error = '';
  showPassword = false;
  emailError = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validateEmail(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.credentials.email) {
      this.emailError = '';
      return false;
    }
    if (!emailPattern.test(this.credentials.email)) {
      this.emailError = 'Please enter a valid email address';
      return false;
    }
    this.emailError = '';
    return true;
  }

  onSubmit() {
    this.error = '';
    this.emailError = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (!this.validateEmail()) {
      return;
    }

    this.loading = true;

    this.authService.login(this.credentials, this.rememberMe).subscribe({
      next: () => {
        this.loading = false;
        if (this.authService.isAuthenticated()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Invalid credentials. Please try again.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Login failed. Please check your credentials and try again.';
      }
    });
  }
}
