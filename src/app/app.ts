import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { Layout } from './layout/layout';
import { IconsModule } from './icons.module';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Layout, IconsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hrm-webapp');
  protected readonly showLayout = signal(true);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // Set initial state
    this.updateLayoutState();

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLayoutState();
    });
  }

  private updateLayoutState(): void {
    // Get the root route's first child
    let route = this.activatedRoute.firstChild;
    
    // Traverse to get the deepest activated route
    while (route?.firstChild) {
      route = route.firstChild;
    }

    // Check route data for layout property (default to true)
    const layoutData = route?.snapshot.data['layout'];
    
    // If layout is explicitly set to false, hide it
    // Otherwise, check if URL contains /auth
    if (layoutData === false) {
      this.showLayout.set(false);
    } else if (this.router.url.includes('/auth')) {
      this.showLayout.set(false);
    } else {
      this.showLayout.set(true);
    }
  }
}
