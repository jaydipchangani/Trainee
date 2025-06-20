import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
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
  hoverLeft = false;
  hoverRight = false;
  private pageHtmlSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private canvasService: CanvasService,
    private htmlGenerator: HtmlGeneratorService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
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
    this.updateScale();
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
    
    // First update the scale and then enter fullscreen
    setTimeout(() => {
      const previewContent = document.querySelector('.preview-content') as HTMLElement;
      const previewMain = document.querySelector('.preview-main') as HTMLElement;
      const previewIframe = document.querySelector('.preview-iframe') as HTMLElement;
      
      // Add presentation mode classes
      previewContent?.classList.add('presentation-mode');
      previewMain?.classList.add('presentation-mode');
      previewIframe?.classList.add('presentation-mode');
      
      // Set initial presentation dimensions
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight;
      const baseWidth = 775;
      const baseHeight = 440;
      
      const scaleX = availableWidth / baseWidth;
      const scaleY = availableHeight / baseHeight;
      const scale = Math.min(scaleX, scaleY, 0.95);
      
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--presentation-scale', scale.toString());
        document.documentElement.style.setProperty('--canvas-width', `${baseWidth}px`);
        document.documentElement.style.setProperty('--canvas-height', `${baseHeight}px`);

        // Request fullscreen after styles are applied
        if (previewContent.requestFullscreen) {
          previewContent.requestFullscreen();
        }
      });

      this.setPresentationPage();
      window.addEventListener('keydown', this.handlePresentationKey);
      document.addEventListener('fullscreenchange', this.exitPresentationOnClose);
    }, 100);
  }

  onExitPresentationClick() {
    this.exitFullscreen();
    // exitPresentationMode will be called by fullscreenchange event, but also call as fallback
    setTimeout(() => this.exitPresentationMode(), 200);
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

  public isMobileView: boolean = false;

  @HostListener('window:resize')
  onResize() {
    this.updateScale();
  }

  private updateScale() {
    if (this.isPresentationMode) {
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight;
      
      // Base dimensions (adjusted to match canvas size)
      const baseWidth = 775;
      const baseHeight = 440;
      
      // Calculate scale while maintaining aspect ratio and adding margin
      const scaleX = (availableWidth ) / baseWidth; // 90% of available width
      const scaleY = (availableHeight) / baseHeight; // 90% of available height
      const scale = Math.min(scaleX, scaleY);
      
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--presentation-scale', scale.toString());
        document.documentElement.style.setProperty('--canvas-width', `${baseWidth}px`);
        document.documentElement.style.setProperty('--canvas-height', `${baseHeight}px`);
      });
    } else {
      // Normal view scaling
      const padding = 32;
      const availableWidth = window.innerWidth - padding;
      const availableHeight = window.innerHeight - padding;
      
      const scaleX = availableWidth / 775;
      const scaleY = availableHeight / 440;
      const scale = Math.min(scaleX, scaleY);
      
      document.documentElement.style.setProperty('--preview-scale', scale.toString());
    }
  }

  private checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    this.isMobileView = screenWidth <= 768;
  }
}
