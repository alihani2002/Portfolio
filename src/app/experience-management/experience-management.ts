import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExperienceService, ExperienceDto } from '../services/experience.service';

@Component({
  selector: 'app-experience-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './experience-management.html',
  styleUrl: '../projects-management/projects-management.css' // Reuse professional styles
})
export class ExperienceManagement implements OnInit {
  private experienceService = inject(ExperienceService);
  private fb = inject(FormBuilder);

  experiences = signal<ExperienceDto[]>([]);
  selectedExperience = signal<ExperienceDto | null>(null);
  isEditing = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);
  error = signal('');
  showModal = signal(false);
  
  expForm: FormGroup;

  constructor() {
    this.expForm = this.fb.group({
      companyName: ['', Validators.required],
      role: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
  }

  ngOnInit() {
    this.loadExperiences();
  }

  loadExperiences() {
    this.isLoading.set(true);
    this.experienceService.getAll().subscribe({
      next: (data) => {
        this.experiences.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load experiences');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.selectedExperience.set(null);
    this.expForm.reset();
    this.showModal.set(true);
  }

  editExperience(exp: ExperienceDto) {
    this.isEditing.set(true);
    this.selectedExperience.set(exp);
    this.showModal.set(true);
    this.expForm.patchValue({
      companyName: exp.companyName,
      role: exp.role,
      description: exp.description,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
    });
  }

  onSubmit() {
    if (this.expForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.expForm.value;
    const expDto: ExperienceDto = {
      ...formValue,
      id: this.selectedExperience()?.id
    };

    const action = this.isEditing() && expDto.id
      ? this.experienceService.update(expDto.id, expDto)
      : this.experienceService.create(expDto);

    action.subscribe({
      next: () => {
        this.loadExperiences();
        this.isSubmitting.set(false);
        this.closeModal();
      },
      error: () => {
        this.error.set('Failed to save experience');
        this.isSubmitting.set(false);
      }
    });
  }

  deleteExperience(id: number | undefined) {
    if (!id || !confirm('Are you sure you want to delete this experience?')) return;

    this.experienceService.delete(id).subscribe({
      next: () => this.loadExperiences(),
      error: () => this.error.set('Failed to delete experience')
    });
  }

  closeModal() {
    this.selectedExperience.set(null);
    this.showModal.set(false);
  }
}
