import { AfterViewInit, Component } from '@angular/core';
import * as feather from 'feather-icons';
import { IconsModule } from '../../../icons.module';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [IconsModule, CommonModule, RouterLink,RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar{
  public menuItems = [
    {id: 1, label: 'Dashboard', icon: 'home', link: '/dashboard' },
    {id: 2,  label: 'Employees', icon: 'users', link: '/employees' },
    {id: 3,  label: 'Departments', icon: 'grid', link: '/departments' },
    {id: 4,  label: 'Attendance', icon: 'check-square', link: '/attendance' },
    {id: 5,  label: 'Leave Management', icon: 'calendar', link: '/leave-management' },
    {id: 6,  label: 'Payroll', icon: 'dollar-sign', link: '/payroll' },
    {id: 7,  label: 'Reports', icon: 'bar-chart-2', link: '/reports' },
    {id: 8,  label: 'Settings', icon: 'settings', link: '/settings' }
  ]

}
