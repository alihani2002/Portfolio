/**
 * =====================================================
 * FILE: src/app/app.routes.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This file DEFINES the ROUTES (navigation paths) for the app.
 * هذا الملف يعرف مسارات التصفح للتطبيق
 * 
 * Routes: Array that maps URLs to components
 * when user visits /home, show HomeComponent, etc.
 * 
 * Currently: Empty array = no routes defined yet
 * Currently / حالياً: مصفوفة فارغة = لا توجد مسارات محددة
 * 
 * How to add routes / كيفية إضافة مسارات:
 * ```ts
 * export const routes: Routes = [
 *   { path: '', component: HomeComponent },
 *   { path: 'about', component: AboutComponent },
 *   { path: '**', component: NotFoundComponent } // 404 fallback
 * ];
 * ```
 */

import { Routes } from '@angular/router';

export const routes: Routes = [];
