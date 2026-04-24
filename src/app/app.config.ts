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

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
