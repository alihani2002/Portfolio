import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillService, SkillDto } from '../services/skill.service';

@Component({
  selector: 'app-skills-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './skills-management.html',
  styleUrl: '../projects-management/projects-management.css'
})
export class SkillsManagement implements OnInit {
  private skillService = inject(SkillService);
  private fb = inject(FormBuilder);

  skills = signal<SkillDto[]>([]);
  selectedSkill = signal<SkillDto | null>(null);
  isEditing = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);
  error = signal('');
  showModal = signal(false);
  
  skillForm: FormGroup;

  constructor() {
    this.skillForm = this.fb.group({
      name: ['', Validators.required],
      level: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSkills();
  }

  loadSkills() {
    this.isLoading.set(true);
    this.skillService.getAll().subscribe({
      next: (data) => {
        this.skills.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load skills');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.isEditing.set(false);
    this.selectedSkill.set(null);
    this.showModal.set(true);
    this.skillForm.reset({ level: 50 });
  }

  editSkill(skill: SkillDto) {
    this.isEditing.set(true);
    this.selectedSkill.set(skill);
    this.showModal.set(true);
    this.skillForm.patchValue({
      name: skill.name,
      level: skill.level,
      category: skill.category
    });
  }

  onSubmit() {
    if (this.skillForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.skillForm.value;
    const skillDto: SkillDto = {
      ...formValue,
      id: this.selectedSkill()?.id
    };

    const action = this.isEditing() && skillDto.id
      ? this.skillService.update(skillDto.id, skillDto)
      : this.skillService.create(skillDto);

    action.subscribe({
      next: () => {
        this.loadSkills();
        this.isSubmitting.set(false);
        this.closeModal();
      },
      error: () => {
        this.error.set('Failed to save skill');
        this.isSubmitting.set(false);
      }
    });
  }

  deleteSkill(id: number | undefined) {
    if (!id || !confirm('Are you sure you want to delete this skill?')) return;

    this.skillService.delete(id).subscribe({
      next: () => this.loadSkills(),
      error: () => this.error.set('Failed to delete skill')
    });
  }

  closeModal() {
    this.selectedSkill.set(null);
    this.showModal.set(false);
  }
}
