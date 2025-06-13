import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanvasService } from '../../services/canvas.service';
import { HtmlGeneratorService } from '../../services/html-generator.service';
import { Subscription } from 'rxjs';

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
  isPresentationMode = false;
  currentPresentationPage = 0;
  private pageHtmlSub: Subscription | undefined;

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
      const state = this.canvasService.getShareableState();
      try {
        const parsed = JSON.parse(state);
        this.pageCountArray = Array(parsed.pages?.length || 1).fill(0);
      } catch {
        this.pageCountArray = [0];
      }
      this.setPresentationPage();
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

  enterPresentationMode() {
    this.isPresentationMode = true;
    this.currentPresentationPage = 0;
    setTimeout(() => {
      const preview = document.querySelector('.preview-content') as HTMLElement;
      if (preview.requestFullscreen) {
        preview.requestFullscreen();
      } else if ((preview as any).webkitRequestFullscreen) {
        (preview as any).webkitRequestFullscreen();
      } else if ((preview as any).msRequestFullscreen) {
        (preview as any).msRequestFullscreen();
      }
      this.setPresentationPage();
      window.addEventListener('keydown', this.handlePresentationKey);
      document.addEventListener('fullscreenchange', this.exitPresentationOnClose);
    }, 0);
  }

  exitPresentationMode() {
    this.isPresentationMode = false;
    window.removeEventListener('keydown', this.handlePresentationKey);
    document.removeEventListener('fullscreenchange', this.exitPresentationOnClose);
  }

  handlePresentationKey = (event: KeyboardEvent) => {
    if (!this.isPresentationMode) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      this.nextPresentationPage();
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      this.prevPresentationPage();
    } else if (event.key === 'Escape') {
      this.exitFullscreen();
    }
  };

  exitPresentationOnClose = () => {
    if (!document.fullscreenElement) {
      this.exitPresentationMode();
    }
  };

  setPresentationPage() {
    if (this.pageHtmlSub) this.pageHtmlSub.unsubscribe();
    this.pageHtmlSub = this.htmlGenerator.getSinglePageHtmlOutput(this.currentPresentationPage).subscribe(html => {
      this.htmlPreview = html;
      this.setIframeContent();
    });
  }

  nextPresentationPage() {
    if (this.currentPresentationPage < this.pageCountArray.length - 1) {
      this.currentPresentationPage++;
      this.setPresentationPage();
    }
  }

  prevPresentationPage() {
    if (this.currentPresentationPage > 0) {
      this.currentPresentationPage--;
      this.setPresentationPage();
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
}
