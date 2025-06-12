import { Component } from '@angular/core';
import { ChromeBridgeService } from './services/chrome-bridge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  content: any = null;

  constructor(private chromeBridge: ChromeBridgeService) {}

  fetchContent() {
    this.chromeBridge.fetchDataFromExtension('websiteData').subscribe(data => {
      this.content = data;
      console.log('📦 Data received from Chrome extension:', data);
    });
  }
}
