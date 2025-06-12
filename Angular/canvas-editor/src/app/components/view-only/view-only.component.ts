import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanvasService } from '../../services/canvas.service';
import { HtmlGeneratorService } from '../../services/html-generator.service';

@Component({
  selector: 'app-view-only',
  templateUrl: './view-only.component.html',
  styleUrls: ['./view-only.component.scss']
})
export class ViewOnlyComponent implements OnInit, AfterViewInit {
  htmlPreview: string = '';
  pageCountArray: number[] = [];
  iframeHeight: number = 600;
  @ViewChild('previewIframe') previewIframe!: ElementRef<HTMLIFrameElement>;

  constructor(
    private route: ActivatedRoute,
    private canvasService: CanvasService,
    private htmlGenerator: HtmlGeneratorService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const key = params['data'];
      if (key) {
        const state = localStorage.getItem(key);
        if (state) {
          this.canvasService.loadStateFromJson(state);
        } else {
          this.canvasService.loadStateFromJson('');
        }
      }
    });

    this.htmlGenerator.getHtmlOutput().subscribe(html => {
      this.htmlPreview = html;
      this.setIframeContent();
      // Update page count for navigation
      const state = this.canvasService.getShareableState();
      try {
        const parsed = JSON.parse(state);
        this.pageCountArray = Array(parsed.pages?.length || 1).fill(0);
        this.iframeHeight = (parsed.pages?.length || 1) * 600;
      } catch {
        this.pageCountArray = [0];
        this.iframeHeight = 600;
      }
    });
  }

  ngAfterViewInit() {
    this.setIframeContent();
  }

  setIframeContent() {
    if (this.previewIframe && this.previewIframe.nativeElement && this.htmlPreview) {
      const iframe = this.previewIframe.nativeElement;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(this.htmlPreview);
        doc.close();
      }
    }
  }

  scrollToPage(index: number) {
    // Use postMessage to tell the iframe to scroll to the correct page
    if (this.previewIframe && this.previewIframe.nativeElement) {
      this.previewIframe.nativeElement.contentWindow?.postMessage({ scrollToPage: index }, '*');
    }
  }

  copyHtml() {
    const el = document.createElement('textarea');
    el.value = this.htmlPreview;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('HTML copied to clipboard!');
  }
}
