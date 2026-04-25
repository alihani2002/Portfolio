/**
 * =====================================================
 * FILE: src/app/app.ts
 * =====================================================
 * 
 * What it does / ماذا يفعل:
 * This is the MAIN COMPONENT of the Angular app.
 * هذا هو المكون الرئيسي لتطبيق Angular
 * 
 * Component = A reusable UI piece with:
 * - selector: the HTML tag to use it (<app-root>)
 * - templateUrl: the HTML view (what to display)
 * - styleUrl: the CSS styles
 * 
 * @Component: Decorator that marks this class as a component
 * import { Component, signal }: Use Component decorator and signal for reactive data
 * 
 * @Component decorators / مزايا الكومبوننت:
 * - selector: 'app-root' = the HTML tag to place this component
 * - imports: [RouterOutlet] = allows using <router-outlet> for navigation
 * - imports: [Navbar] = navigation component
 * - templateUrl: points to app.html for the view
 * - styleUrl: points to app.css for styles
 * 
 * signal: Angular's way to manage reactive state (like useState in React)
 * signal('Portfolio'): Creates a reactive value called 'title'
 */

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Portfolio');
}