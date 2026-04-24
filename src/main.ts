/**
 * =====================================================
 * FILE: src/main.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This is the ENTRY POINT of the Angular application.
 * هذا هو نقطة البداية لتطبيق Angular
 * 
 * It imports and bootstraps (starts) the main App component
 * with the application configuration.
 * 
 * Steps / الخطوات:
 * 1. Import bootstrapApplication from @angular/platform-browser
 * 2. Import appConfig (configuration) from app.config.ts
 * 3. Import App component from app.ts
 * 4. Start (bootstrap) the app with those configurations
 * 
 * @angular/platform-browser: Provides browser-specific rendering
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));