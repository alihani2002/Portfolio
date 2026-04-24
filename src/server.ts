/**
 * =====================================================
 * FILE: src/server.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This is the NODE/EXPRESS SERVER for SSR (Server-Side Rendering).
 * هذا هو خادم Node/Express لتشغيل SSR
 * 
 * Angular SSR: Server pre-renders Angular pages to HTML
 * This Express server:
 * - Serves static files (CSS, JS, images) from /browser folder
 * - Handles dynamic routes by rendering Angular app
 * - Listens on port 4000 (or PORT env variable)
 * 
 * Express: Node.js web framework for building servers
 * @angular/ssr: Angular's SSR utilities
 * 
 * Key functions / الدوال الرئيسية:
 * - AngularNodeAppEngine(): Handles Angular SSR requests
 * - createNodeRequestHandler(): Creates handler for Angular CLI
 * - express.static(): Serves static files
 * - app.listen(): Starts the server
 */

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
