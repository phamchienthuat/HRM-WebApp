import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './components/toolbar/toolbar';
import { IconsModule } from '../icons.module';
import { SidebarService } from '../shared/services/sidebar.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterOutlet, Toolbar, IconsModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit, OnDestroy {
  isCollapsed = false;
  private subscription?: Subscription;

  constructor(private sidebarService: SidebarService) {}

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
}
