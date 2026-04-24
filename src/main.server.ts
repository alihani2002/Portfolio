/**
 * =====================================================
 * FILE: src/main.server.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This is the SERVER-SIDE ENTRY POINT for SSR (Server-Side Rendering).
 * هذا هو نقطة الدخول للجانب الخادم لتطبيق SSR
 * 
 * SSR = Server-Side Rendering
 * The server pre-renders the Angular app to HTML before sending to browser
 * لتحسين SEO وتحميل أسرع
 * 
 * BootstrapContext: Interface for server bootstrap
 * bootstrapApplication: Function to start Angular on the server
 * 
 * Steps / الخطوات:
 * 1. Creates a bootstrap function that takes context
 * 2. Uses app config from app.config.server.ts
 * 3. Exports it as default for the SSR server
 */

import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
