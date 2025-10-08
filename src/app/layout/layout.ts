import { Component } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './components/toolbar/toolbar';
import { IconsModule } from '../icons.module';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterOutlet, Toolbar, IconsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
