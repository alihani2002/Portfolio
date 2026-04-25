import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SkillDto {
  id?: number;
  name?: string;
  level: number;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly apiUrl = `${environment.apiUrl}Skill`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SkillDto[]> {
    return this.http.get<SkillDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<SkillDto> {
    return this.http.get<SkillDto>(`${this.apiUrl}/${id}`);
  }

  create(skill: SkillDto): Observable<SkillDto> {
    return this.http.post<SkillDto>(this.apiUrl, skill);
  }

  update(id: number, skill: SkillDto): Observable<SkillDto> {
    return this.http.put<SkillDto>(`${this.apiUrl}/${id}`, skill);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}