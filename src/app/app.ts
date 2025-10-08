import { Component, signal } from '@angular/core';
import { Layout } from './layout/layout';
import { IconsModule } from './icons.module';

@Component({
  selector: 'app-root',
  imports: [Layout,IconsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('hrm-webapp');
}
