import { NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ASSETS } from '@core/providers';
import { NavbarComponent } from '@layout/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NgOptimizedImage, NgTemplateOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly assets = inject(ASSETS);
  private readonly router = inject(Router);

  checkIcon = this.assets['check-icon'];
  doneIcon = this.assets['done-icon'];
  tasks: string[] = [
    'Column Wrapper Container: Create a standardized container for consistent column layout.',
    'Base Service for Data Operations: Develop a base service using generics for type-safe list loading and data handling.',
    'Reusable UI Components: Implement reusable data table, sorter, and column filter components with configurable settings.',
    'Dependency Injection: Apply DI for assets and services to streamline component dependencies.',
    'Reactive Programming: Use RxJS and Signals for state and reactivity management.',
    'Custom Directives: Create directives for flexible content projection with ng-template.',
    'Unified Data Operations: Combine filtering, sorting, searching, and pagination into a reactive flow.',
    'Subscription Cleanup: Ensure all subscriptions are properly destroyed to prevent memory leaks.',
  ];

  goToUserList() {
    this.router.navigate(['/users']);
  }
}
