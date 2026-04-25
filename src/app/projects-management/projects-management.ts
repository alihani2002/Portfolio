import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService, ProjectDto } from '../services/project.service';

@Component({
  selector: 'app-projects-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './projects-management.html',
  styleUrl: './projects-management.css'
})
export class ProjectsManagement implements OnInit {
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  projects = signal<ProjectDto[]>([]);
  selectedProject = signal<ProjectDto | null>(null);
  isEditing = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);
  error = signal('');
  showModal = signal(false);
  
  projectForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor() {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      gitHubUrl: [''],
      liveDemoUrl: [''],
      createdAt: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading.set(true);
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load projects');
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.selectedProject.set(null);
    this.showModal.set(true);
    this.imagePreview = null;
    this.selectedFile = null;
    this.projectForm.reset({
      createdAt: new Date().toISOString().split('T')[0]
    });
  }

  editProject(project: ProjectDto) {
    this.isEditing.set(true);
    this.selectedProject.set(project);
    this.showModal.set(true);
    this.imagePreview = project.imageUrl || null;
    this.selectedFile = null;
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      gitHubUrl: project.gitHubUrl,
      liveDemoUrl: project.liveDemoUrl,
      createdAt: project.createdAt ? new Date(project.createdAt).toISOString().split('T')[0] : ''
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.projectForm.value;
    const projectDto: ProjectDto = {
      ...formValue,
      id: this.selectedProject()?.id,
      imageFile: this.selectedFile || undefined
    };

    const action = this.isEditing() && projectDto.id
      ? this.projectService.update(projectDto.id, projectDto)
      : this.projectService.create(projectDto);

    action.subscribe({
      next: () => {
        this.loadProjects();
        this.isSubmitting.set(false);
        this.closeModal();
      },
      error: () => {
        this.error.set('Failed to save project');
        this.isSubmitting.set(false);
      }
    });
  }

  deleteProject(id: number | undefined) {
    if (!id || !confirm('Are you sure you want to delete this project?')) return;

    this.projectService.delete(id).subscribe({
      next: () => this.loadProjects(),
      error: () => this.error.set('Failed to delete project')
    });
  }

  closeModal() {
    this.selectedProject.set(null);
    this.showModal.set(false);
  }
}
