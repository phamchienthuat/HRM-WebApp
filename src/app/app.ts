import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Layout } from './layout/layout';
import { IconsModule } from './icons.module';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Layout, IconsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('hrm-webapp');
  protected readonly showLayout = signal(true);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    // Set initial state
    this.updateLayoutState();

    // Listen to route changes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateLayoutState();
    });
  }

  ngOnInit(): void {
    // Initialize translation
    this.translate.addLangs(['en', 'vi']);
    this.translate.setDefaultLang('en');

    // Check localStorage first, then browser language, then default
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && ['en', 'vi'].includes(savedLang)) {
      this.translate.use(savedLang);
    } else {
      const browserLang = this.translate.getBrowserLang();
      const lang = browserLang && ['en', 'vi'].includes(browserLang) ? browserLang : 'en';
      this.translate.use(lang);
    }
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
