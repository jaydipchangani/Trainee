import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'canvas-editor';

  constructor() {
    // Clear only the canvas state on refresh
    localStorage.removeItem('canvas_pages_state');
  }
}
