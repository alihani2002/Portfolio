import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EducationDto {
  id?: number;
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private readonly apiUrl = `${environment.apiUrl}Education`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EducationDto[]> {
    return this.http.get<EducationDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<EducationDto> {
    return this.http.get<EducationDto>(`${this.apiUrl}/${id}`);
  }

  create(education: EducationDto): Observable<EducationDto> {
    return this.http.post<EducationDto>(this.apiUrl, education);
  }

  update(id: number, education: EducationDto): Observable<EducationDto> {
    return this.http.put<EducationDto>(`${this.apiUrl}/${id}`, education);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}