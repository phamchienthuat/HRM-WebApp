import { Component } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './components/toolbar/toolbar';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterOutlet, Toolbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
