  import { Injectable, NgZone } from '@angular/core';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ChromeBridgeService {

    constructor(private zone: NgZone) {
      window.addEventListener('message', this.handleResponse.bind(this));
    }

    private observerMap: { [key: string]: (value: any) => void } = {};

    fetchDataFromExtension(key: string): Observable<any> {
      return new Observable(observer => {
        this.observerMap[key] = (data) => {
          this.zone.run(() => observer.next(data));
        };

        window.postMessage({
          type: 'FROM_WEB_APP',
          key: key
        }, '*');
      });
    }

    private handleResponse(event: MessageEvent) {
      if (event.source !== window || !event.data || event.data.type !== 'FROM_EXTENSION') {
        return;
      }

      const data = event.data.data;
      const key = 'websiteData'; // Match the key used in content script

      if (this.observerMap[key]) {
        this.observerMap[key](data);
        delete this.observerMap[key]; // Clean up
      }
    }
  }
