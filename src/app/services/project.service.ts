import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProjectDto {
  id?: number;
  title?: string;
  description?: string;
  imageFile?: File;
  imageUrl?: string;
  gitHubUrl?: string;
  liveDemoUrl?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}Project`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.apiUrl}/${id}`);
  }

  create(project: ProjectDto): Observable<ProjectDto> {
    const formData = this.createFormData(project);
    return this.http.post<ProjectDto>(this.apiUrl, formData);
  }

  update(id: number, project: ProjectDto): Observable<ProjectDto> {
    const formData = this.createFormData(project);
    return this.http.put<ProjectDto>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private createFormData(project: ProjectDto): FormData {
    const formData = new FormData();

    if (project.title) formData.append('Title', project.title);
    if (project.description) formData.append('Description', project.description);
    if (project.imageFile) formData.append('ImageFile', project.imageFile);
    if (project.imageUrl) formData.append('ImageUrl', project.imageUrl);
    if (project.gitHubUrl) formData.append('GitHubUrl', project.gitHubUrl);
    if (project.liveDemoUrl) formData.append('LiveDemoUrl', project.liveDemoUrl);
    if (project.createdAt) formData.append('CreatedAt', project.createdAt);

    return formData;
  }
}