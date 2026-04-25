/**
 * =====================================================
 * FILE: src/app/navbar/navbar.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This is the NAVBAR COMPONENT - displays navigation.
 * هذا هو مكون شريط التنقل - يعرض روابط التصفح
 * 
 * Uses RouterLink for navigation links:
 * - routerLink: directive for linking to routes
 * - routerLinkActive: highlight active route
 */

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isAuthenticated$;
  theme$;
  isMobileMenuOpen = false;
  isScrolled = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private themeService: ThemeService
  ) {
    this.isAuthenticated$ = this.authService.authState$;
    this.theme$ = this.themeService.theme$;
    
    // Track scroll for navbar transparency
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 20;
      });
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.closeMobileMenu();
      this.router.navigate(['/home']);
    });
  }
}
