import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './layout/layout';
import { FeatherIconDirective } from './shared/directives/feather-icon.directive';

@Component({
  selector: 'app-root',
  imports: [Layout,FeatherIconDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hrm-webapp');
}
