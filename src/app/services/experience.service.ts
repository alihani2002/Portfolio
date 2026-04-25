import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExperienceDto {
  id?: number;
  companyName?: string;
  role?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  companyLogoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private readonly apiUrl = `${environment.apiUrl}Experience`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ExperienceDto[]> {
    return this.http.get<ExperienceDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<ExperienceDto> {
    return this.http.get<ExperienceDto>(`${this.apiUrl}/${id}`);
  }

  create(experience: ExperienceDto): Observable<ExperienceDto> {
    return this.http.post<ExperienceDto>(this.apiUrl, experience);
  }

  update(id: number, experience: ExperienceDto): Observable<ExperienceDto> {
    return this.http.put<ExperienceDto>(`${this.apiUrl}/${id}`, experience);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}