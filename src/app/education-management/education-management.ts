import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EducationService, EducationDto } from '../services/education.service';

@Component({
  selector: 'app-education-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './education-management.html',
  styleUrl: '../projects-management/projects-management.css'
})
export class EducationManagement implements OnInit {
  private educationService = inject(EducationService);
  private fb = inject(FormBuilder);

  educations = signal<EducationDto[]>([]);
  selectedEducation = signal<EducationDto | null>(null);
  isEditing = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);
  error = signal('');
  showModal = signal(false);
  
  eduForm: FormGroup;

  constructor() {
    this.eduForm = this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
  }

  ngOnInit() {
    this.loadEducations();
  }

  loadEducations() {
    this.isLoading.set(true);
    this.educationService.getAll().subscribe({
      next: (data) => {
        this.educations.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load education records');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.selectedEducation.set(null);
    this.eduForm.reset();
    this.showModal.set(true);
  }

  editEducation(edu: EducationDto) {
    this.isEditing.set(true);
    this.selectedEducation.set(edu);
    this.showModal.set(true);
    this.eduForm.patchValue({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''
    });
  }

  onSubmit() {
    if (this.eduForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.eduForm.value;
    const eduDto: EducationDto = {
      ...formValue,
      id: this.selectedEducation()?.id
    };

    const action = this.isEditing() && eduDto.id
      ? this.educationService.update(eduDto.id, eduDto)
      : this.educationService.create(eduDto);

    action.subscribe({
      next: () => {
        this.loadEducations();
        this.isSubmitting.set(false);
        this.closeModal();
      },
      error: () => {
        this.error.set('Failed to save education record');
        this.isSubmitting.set(false);
      }
    });
  }

  deleteEducation(id: number | undefined) {
    if (!id || !confirm('Are you sure you want to delete this record?')) return;

    this.educationService.delete(id).subscribe({
      next: () => this.loadEducations(),
      error: () => this.error.set('Failed to delete record')
    });
  }

  closeModal() {
    this.selectedEducation.set(null);
    this.showModal.set(false);
  }
}
