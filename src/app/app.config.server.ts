/**
 * =====================================================
 * FILE: src/app/app.config.server.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This is the SERVER-SIDE CONFIGURATION for SSR.
 * هذا هو تكوين جانب الخادم لـ SSR
 * 
 * Merges: base app config + server-specific config
 * يدمج: تكوين التطبيق الأساسي + تكوين الخادم
 * 
 * Key functions / الدوال الرئيسية:
 * - mergeApplicationConfig(): Combines two configs
 * - provideServerRendering(): Enables SSR features
 * - withRoutes(): Specifies which routes to prerender
 *    (from app.routes.server.ts)
 */

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
