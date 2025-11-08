import { Component, OnInit, OnDestroy } from '@angular/core';
import { IconsModule } from '../../../icons.module';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BaseHttpService } from '../../../core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-toolbar',
  imports: [IconsModule, CommonModule, TranslateModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar implements OnInit, OnDestroy {
  userName = '';
  isCollapsed = false;
  currentLang = 'en';
  private subscription?: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private httpService: BaseHttpService,
    private notification: NotificationService,
    public translate: TranslateService
  ) {
    let userName = localStorage.getItem('user') || '';
    try {
      this.userName = userName ? JSON.parse(userName).username : '';
    } catch (e) {
      this.userName = userName;
    }

    // Get current language
    this.currentLang =
      this.translate.currentLang || localStorage.getItem('selectedLanguage') || 'en';
  }

  ngOnInit(): void {
    this.subscription = this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isCollapsed = collapsed;
    });

    // Subscribe to language changes to keep currentLang in sync
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    // Set initial language from TranslateService
    if (this.translate.currentLang) {
      this.currentLang = this.translate.currentLang;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('selectedLanguage', lang);
    this.notification.success(
      `Language changed to ${lang === 'en' ? 'English' : 'Vietnamese'}`,
      'Language'
    );
  }

  getCurrentLanguageLabel(): string {
    return this.currentLang === 'en' ? 'English' : 'Tiếng Việt';
  }

  getCurrentLanguageFlag(): string {
    return this.currentLang === 'en' ? '🇺🇸' : '🇻🇳';
  }

  goToProfile() {
    this.router
      .navigate(['/auth/profile'])
      .then(() => {
        this.notification.info('Navigating to profile page', 'Profile');
      })
      .catch(() => {
        this.router.navigate(['/profile']).catch(() => {
          this.notification.warning('Profile page not found', 'Navigation');
        });
      });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    this.notification.success('You have been logged out successfully', 'Logout');
    this.router.navigate(['/auth/login']).catch(() => {
      this.router.navigate(['/login']).catch(() => {
        this.notification.error('Could not redirect to login page', 'Navigation Error');
      });
    });
  }

  logoutAPI() {
    const loadingId = this.notification.loading('Logging out...', 'Please wait');

    this.httpService.post('/api/auth/logout', {}).subscribe({
      next: () => {
        this.notification.remove(loadingId);
        this.logout();
      },
      error: (err) => {
        this.notification.remove(loadingId);
        this.notification.httpError(err, 'Logout API failed, proceeding with local logout');
        console.error('Logout API failed', err);
        this.logout();
      },
    });
  }
}
