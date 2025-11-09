import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import * as feather from 'feather-icons';
import { IconsModule } from '../../../icons.module';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { Subscription } from 'rxjs';

interface MenuItem {
  id: number;
  label: string;
  icon: string;
  link?: string;
  childrens?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [IconsModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit, OnDestroy {
  public menuItems: MenuItem[] = [
    { id: 1, label: 'Dashboard', icon: 'home', link: '/dashboard' },
    {
      id: 2,
      label: 'Employees',
      icon: 'users',
      link: '/employees',
      expanded: false,
      childrens: [
        {
          id: 20,
          label: 'Business',
          icon: 'briefcase',
          expanded: false,
          childrens: [
            { id: 21, label: 'All Employees', icon: 'users', link: '/employees/all' },
            { id: 23, label: 'Employee Profile', icon: 'user', link: '/employees/profile' },
          ],
        },
        {
          id: 24,
          label: 'Management',
          icon: 'list',
          expanded: false,
          childrens: [{ id: 25, label: 'Add Employee', icon: 'user-plus', link: '/employees/add' }],
        },
      ],
    },
    { id: 3, label: 'Departments', icon: 'grid', link: '/departments' },
    { id: 4, label: 'Attendance', icon: 'check-square', link: '/attendance' },
    { id: 5, label: 'Leave Management', icon: 'calendar', link: '/leave-management' },
    { id: 6, label: 'Payroll', icon: 'dollar-sign', link: '/payroll' },
    { id: 7, label: 'Reports', icon: 'bar-chart-2', link: '/reports' },
    { id: 8, label: 'Settings', icon: 'settings', link: '/settings' },
  ];

  isCollapsed = false;
  private subscription?: Subscription;

  constructor(private sidebarService: SidebarService) {
    // Initialize from localStorage on component creation
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.isCollapsed = savedState === 'true';
      // Sync with service
      this.sidebarService.setSidebarState(this.isCollapsed);
    }
  }

  ngOnInit(): void {
    this.subscription = this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isCollapsed = collapsed;
      // Save to localStorage whenever state changes
      localStorage.setItem('sidebarCollapsed', collapsed.toString());
      // Collapse all submenus when sidebar is collapsed
      if (collapsed) {
        this.collapseAllMenus();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSubmenu(item: MenuItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isCollapsed) {
      return; // Don't toggle when sidebar is collapsed
    }

    item.expanded = !item.expanded;
  }

  private collapseAllMenus(): void {
    const collapseRecursive = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.childrens) {
          item.expanded = false;
          collapseRecursive(item.childrens);
        }
      });
    };
    collapseRecursive(this.menuItems);
  }

  hasChildren(item: MenuItem): boolean {
    return !!item.childrens && item.childrens.length > 0;
  }
}
