import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService, ProfileDto } from '../services/profile.service';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-management.html',
  styleUrl: '../projects-management/projects-management.css'
})
export class ProfileManagement implements OnInit {
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);

  profileData = signal<ProfileDto | null>(null);
  isLoading = signal(false);
  isSubmitting = signal(false);
  error = signal('');
  
  profileForm: FormGroup;
  selectedImage: File | null = null;
  selectedCv: File | null = null;
  imagePreview: string | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      title: ['', Validators.required],
      bio: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      linkedInUrl: [''],
      gitHubUrl: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading.set(true);
    this.profileService.getAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const profile = data[0];
          this.profileData.set(profile);
          this.imagePreview = profile.imageUrl || null;
          this.profileForm.patchValue({
            fullName: profile.fullName,
            title: profile.title,
            bio: profile.bio,
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            linkedInUrl: profile.linkedInUrl,
            gitHubUrl: profile.gitHubUrl
          });
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load profile');
        this.isLoading.set(false);
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onCvSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedCv = file;
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.profileForm.value;
    const profile: ProfileDto = {
      ...formValue,
      id: this.profileData()?.id,
      imageFile: this.selectedImage || undefined,
      cvFile: this.selectedCv || undefined
    };

    const action = profile.id
      ? this.profileService.update(profile.id, profile)
      : this.profileService.create(profile);

    action.subscribe({
      next: () => {
        this.loadProfile();
        this.isSubmitting.set(false);
        alert('Profile saved successfully!');
      },
      error: () => {
        this.error.set('Failed to save profile');
        this.isSubmitting.set(false);
      }
    });
  }
}