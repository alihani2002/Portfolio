import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProfileDto {
  id?: number;
  fullName?: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  imageFile?: File;
  cvFile?: File;
  imageUrl?: string;
  cvUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiUrl}Profile`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProfileDto[]> {
    return this.http.get<ProfileDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProfileDto> {
    return this.http.get<ProfileDto>(`${this.apiUrl}/${id}`);
  }

  create(profile: ProfileDto): Observable<ProfileDto> {
    const formData = this.createFormData(profile);
    return this.http.post<ProfileDto>(this.apiUrl, formData);
  }

  update(id: number, profile: ProfileDto): Observable<ProfileDto> {
    const formData = this.createFormData(profile);
    return this.http.put<ProfileDto>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private createFormData(profile: ProfileDto): FormData {
    const formData = new FormData();

    if (profile.fullName) formData.append('FullName', profile.fullName);
    if (profile.title) formData.append('Title', profile.title);
    if (profile.bio) formData.append('Bio', profile.bio);
    if (profile.email) formData.append('Email', profile.email);
    if (profile.phone) formData.append('Phone', profile.phone);
    if (profile.location) formData.append('Location', profile.location);
    if (profile.linkedInUrl) formData.append('LinkedInUrl', profile.linkedInUrl);
    if (profile.gitHubUrl) formData.append('GitHubUrl', profile.gitHubUrl);
    if (profile.imageFile) formData.append('ImageFile', profile.imageFile);
    if (profile.cvFile) formData.append('CvFile', profile.cvFile);
    if (profile.imageUrl) formData.append('ImageUrl', profile.imageUrl);
    if (profile.cvUrl) formData.append('CvUrl', profile.cvUrl);

    return formData;
  }
}