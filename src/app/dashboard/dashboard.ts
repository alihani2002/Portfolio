/**
 * =====================================================
 * FILE: src/app/dashboard/dashboard.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This is the DASHBOARD COMPONENT - shows portfolio overview.
 * هذا هو مكون الـ Dashboard - يعرض نظرة عامة على المحفظة
 * 
 * Contains:
 * - Portfolio summary stats (total value, today's change)
 * - Recent transactions list
 * - Asset allocation chart data
 * 
 * signal: Used for reactive state management
 * signal computed: Derived values that auto-update
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EducationService, EducationDto } from '../services/education.service';
import { ExperienceService, ExperienceDto } from '../services/experience.service';
import { ProjectService, ProjectDto } from '../services/project.service';
import { SkillService, SkillDto } from '../services/skill.service';
import { ContactMessageService, ContactMessageDto } from '../services/contact-message.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  contactMessages: ContactMessageDto[] = [];
  selectedMessage: ContactMessageDto | null = null;

  educations: EducationDto[] = [];
  experiences: ExperienceDto[] = [];
  projects: ProjectDto[] = [];
  skills: SkillDto[] = [];

  loadingStates = {
    messages: true,
    education: true,
    experience: true,
    projects: true,
    skills: true
  };

  error = '';

  constructor(
    private contactMessageService: ContactMessageService,
    private educationService: EducationService,
    private experienceService: ExperienceService,
    private projectService: ProjectService,
    private skillService: SkillService
  ) {}

  get isLoading(): boolean {
    return this.loadingStates.messages ||
           this.loadingStates.education ||
           this.loadingStates.experience ||
           this.loadingStates.projects ||
           this.loadingStates.skills;
  }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.error = '';
    this.loadContactMessages();
    this.loadEducation();
    this.loadExperience();
    this.loadProjects();
    this.loadSkills();
  }

  private loadContactMessages() {
    this.loadingStates.messages = true;
    this.contactMessageService.getAll().subscribe({
      next: (data) => { 
        this.contactMessages = data; 
        this.loadingStates.messages = false; 
      },
      error: () => this.handleError('messages')
    });
  }

  private loadEducation() {
    this.loadingStates.education = true;
    this.educationService.getAll().subscribe({
      next: (data) => {
        this.educations = data;
        this.loadingStates.education = false;
      },
      error: () => this.handleError('education')
    });
  }

  private loadExperience() {
    this.loadingStates.experience = true;
    this.experienceService.getAll().subscribe({
      next: (data) => {
        this.experiences = data;
        this.loadingStates.experience = false;
      },
      error: () => this.handleError('experience')
    });
  }

  private loadProjects() {
    this.loadingStates.projects = true;
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.loadingStates.projects = false;
      },
      error: () => this.handleError('projects')
    });
  }

  private loadSkills() {
    this.loadingStates.skills = true;
    this.skillService.getAll().subscribe({
      next: (data) => {
        this.skills = data;
        this.loadingStates.skills = false;
      },
      error: () => this.handleError('skills')
    });
  }

  private handleError(section: 'messages' | 'education' | 'experience' | 'projects' | 'skills') {
    (this.loadingStates as Record<string, boolean>)[section] = false;
    this.error = `Failed to load ${section} data. Please try refreshing.`;
  }

  refreshData() {
    this.loadAllData();
  }

  viewMessage(msg: ContactMessageDto) {
    this.selectedMessage = msg;
  }

  closeModal() {
    this.selectedMessage = null;
  }

  deleteMessage(id: number | undefined) {
    if (!id || !confirm('Permanently delete this message?')) return;
    this.contactMessageService.delete(id).subscribe({
      next: () => {
        this.loadContactMessages();
        this.closeModal();
      },
      error: () => this.handleError('messages')
    });
  }
}
