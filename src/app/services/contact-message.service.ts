import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactMessageDto {
  id?: number;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  sentAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactMessageService {
  private readonly apiUrl = `${environment.apiUrl}ContactMessage`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContactMessageDto[]> {
    return this.http.get<ContactMessageDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<ContactMessageDto> {
    return this.http.get<ContactMessageDto>(`${this.apiUrl}/${id}`);
  }

  create(message: ContactMessageDto): Observable<ContactMessageDto> {
    return this.http.post<ContactMessageDto>(this.apiUrl, message);
  }

  update(id: number, message: ContactMessageDto): Observable<ContactMessageDto> {
    return this.http.put<ContactMessageDto>(`${this.apiUrl}/${id}`, message);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}