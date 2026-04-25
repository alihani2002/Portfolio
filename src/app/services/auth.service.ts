import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  email: string;
  token: string;
  // Add other user fields here if needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.authState.next(this.isAuthenticated());
    }
  }

  login(credentials: LoginDto, rememberMe: boolean = false): Observable<any> {
    return this.http.post(`${environment.apiUrl}Auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.setSession(response.token, credentials.email, rememberMe);
        }
      })
    );
  }

  logout(): Observable<any> {
    // We attempt to call the backend logout, but we clear local cache regardless
    return this.http.post(`${environment.apiUrl}Auth/logout`, {}).pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession(); // Ensure local cache is cleared anyway
        return of(null);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getUserEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    }
    return null;
  }

  private setSession(token: string, email: string, rememberMe: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clearSession(); // Start fresh
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.TOKEN_KEY, token);
      storage.setItem(this.USER_KEY, email);
      
      this.authState.next(true);
    }
  }

  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only remove auth keys, not all storage data
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
      
      this.authState.next(false);
    }
  }
}
