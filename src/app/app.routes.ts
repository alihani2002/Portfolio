/**
 * =====================================================
 * FILE: src/app/app.routes.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This file DEFINES the ROUTES (navigation paths) for the app.
 * هذا الملف يعرف مسارات التصفح للتطبيق
 * 
 * Routes: Array that maps URLs to components
 * when user visits /dashboard, show DashboardComponent, etc.
 * 
 * Key route options:
 * - path: URL path (e.g., '', 'dashboard', 'about')
 * - component: Component to display
 * - redirectTo: Redirect to another path
 * - pathMatch: 'full' or 'prefix'
 * - **: Wildcard for 404 (must be last)
 */

import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { About } from './about/about';
import { Home } from './home/home';
import { LogIn } from './log-in/log-in';
import { ProfileManagement } from './profile-management/profile-management';
import { EducationManagement } from './education-management/education-management';
import { ExperienceManagement } from './experience-management/experience-management';
import { ProjectsManagement } from './projects-management/projects-management';
import { SkillsManagement } from './skills-management/skills-management';
import { ContactMessages } from './contact-messages/contact-messages';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LogIn,
    canActivate: [NoAuthGuard]
  },
  {
    path: 'profile',
    component: ProfileManagement,
    canActivate: [AuthGuard]
  },
  {
    path: 'education',
    component: EducationManagement,
    canActivate: [AuthGuard]
  },
  {
    path: 'experience',
    component: ExperienceManagement,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    component: ProjectsManagement,
    canActivate: [AuthGuard]
  },
  {
    path: 'skills',
    component: SkillsManagement,
    canActivate: [AuthGuard]
  },
  {
    path: 'contact-messages',
    component: ContactMessages,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];