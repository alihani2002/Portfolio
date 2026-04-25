/**
 * =====================================================
 * FILE: src/app/app.config.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This file CONFIGUREs the Angular application.
 * هذا الملف يقوم بتكوين التطبيق
 * 
 * ApplicationConfig: Type for Angular app configuration
 * provides: Array of providers (services, features)
 * 
 * Providers included / المزودين:
 * 1. provideBrowserGlobalErrorListeners()
 *    - Catches JavaScript errors in the browser
 *    - ي捕获 المتصفح أخطاء JavaScript
 * 
 * 2. provideRouter(routes)
 *    - Enables routing/navigation
 *    - يتفعيل التوجيه والتصفح
 *    - routes imported from app.routes.ts
 * 
 * 3. provideClientHydration(withEventReplay())
 *    - SSR feature: caches page HTML for fast load
 *    - Server sends pre-rendered HTML, then "hydrates" with JS
 *    - ميزية SSR: يخزن HTML لتحميل سريع ثم يربطه بالـ JavaScript
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter, withInMemoryScrolling, Router } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';

const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};

const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout().subscribe();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
      withFetch()
    ),
    provideClientHydration(withEventReplay())
  ]
};
