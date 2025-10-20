import { Component, OnInit, OnDestroy } from '@angular/core';
import { IconsModule } from '../../../icons.module';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  imports: [IconsModule, CommonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class Toolbar implements OnInit, OnDestroy {
  userName = '';
  isCollapsed = false;
  private subscription?: Subscription;
  
  constructor(private sidebarService: SidebarService) {
   let userName= localStorage.getItem('user') || '';
    this.userName= JSON.parse(userName).username;
  }

  ngOnInit(): void {
    this.subscription = this.sidebarService.isCollapsed$.subscribe(
      (collapsed) => {
        this.isCollapsed = collapsed;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
