/**
 * =====================================================
 * FILE: src/app/app.routes.server.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This defines SERVER-SIDE ROUTES for SSR prerendering.
 * هذا يعرف مسارات الخادم لـ SSR
 * 
 * RenderMode: Enum defining how pages render
 * - Prerender: Pre-render to HTML on server
 * - Server: Render on demand on server  
 * - Client: Render in browser only
 * 
 * Current setup: All routes prerender (''' = all paths)
 * current / الإعداد الحالي: جميع المسارات تُعرض مسبقاً
 * 
 * This improves SEO and initial load time
 * هذا يحسن SEO ووقت التحميل الأولي
 */

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
