import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService, ProfileDto } from '../services/profile.service';
import { EducationService, EducationDto } from '../services/education.service';
import { ExperienceService, ExperienceDto } from '../services/experience.service';
import { ProjectService, ProjectDto } from '../services/project.service';
import { SkillService, SkillDto } from '../services/skill.service';
import { ContactMessageService } from '../services/contact-message.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private profileService = inject(ProfileService);
  private educationService = inject(EducationService);
  private experienceService = inject(ExperienceService);
  private projectService = inject(ProjectService);
  private skillService = inject(SkillService);
  private contactService = inject(ContactMessageService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private fb = inject(FormBuilder);

  profile: ProfileDto | null = null;
  educations: EducationDto[] = [];
  experiences: ExperienceDto[] = [];
  projects: ProjectDto[] = [];
  skills: SkillDto[] = [];
  
  expandedProjectIds: Set<number> = new Set();
  contactForm: FormGroup;
  loading = true;
  submitting = false;
  submitSuccess = false;
  submitError = '';
  currentYear = new Date().getFullYear();

  isAuthenticated$ = this.authService.authState$;
  theme$ = this.themeService.theme$;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchAllData();
  }

  fetchAllData() {
    this.loading = true;
    Promise.all([
      this.loadProfile(),
      this.loadEducation(),
      this.loadExperience(),
      this.loadProjects(),
      this.loadSkills()
    ]).finally(() => {
      this.loading = false;
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.submitting = true;
    this.submitError = '';
    
    const messageData = {
      ...this.contactForm.value,
      sentAt: new Date().toISOString()
    };

    this.contactService.create(messageData).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.submitting = false;
        this.contactForm.reset();
        setTimeout(() => this.submitSuccess = false, 5000);
      },
      error: (err) => {
        this.submitError = 'Failed to send message. Please try again.';
        this.submitting = false;
      }
    });
  }

  // Group skills by category
  getSkillCategories(): string[] {
    const categories = this.skills.map(s => s.category || 'Other');
    return [...new Set(categories)];
  }

  getSkillsByCategory(category: string): SkillDto[] {
    return this.skills.filter(s => (s.category || 'Other') === category);
  }

  isProjectExpanded(projectId: number | undefined): boolean {
    return projectId !== undefined && this.expandedProjectIds.has(projectId);
  }

  toggleProjectDescription(projectId: number | undefined) {
    if (projectId === undefined) return;
    if (this.expandedProjectIds.has(projectId)) {
      this.expandedProjectIds.delete(projectId);
    } else {
      this.expandedProjectIds.add(projectId);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
  }

  private loadProfile(): Promise<void> {
    return new Promise((resolve) => {
      this.profileService.getAll().subscribe({
        next: (data) => { this.profile = data[0] || null; resolve(); },
        error: () => resolve()
      });
    });
  }

  private loadEducation(): Promise<void> {
    return new Promise((resolve) => {
      this.educationService.getAll().subscribe({
        next: (data) => { this.educations = data; resolve(); },
        error: () => resolve()
      });
    });
  }

  private loadExperience(): Promise<void> {
    return new Promise((resolve) => {
      this.experienceService.getAll().subscribe({
        next: (data) => { this.experiences = data; resolve(); },
        error: () => resolve()
      });
    });
  }

  private loadProjects(): Promise<void> {
    return new Promise((resolve) => {
      this.projectService.getAll().subscribe({
        next: (data) => { this.projects = data; resolve(); },
        error: () => resolve()
      });
    });
  }

  private loadSkills(): Promise<void> {
    return new Promise((resolve) => {
      this.skillService.getAll().subscribe({
        next: (data) => { this.skills = data; resolve(); },
        error: () => resolve()
      });
    });
  }
}
