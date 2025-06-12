import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CanvasService, CanvasElement, CanvasPage } from './canvas.service';

@Injectable({
  providedIn: 'root'
})
export class HtmlGeneratorService {
  constructor(private canvasService: CanvasService) {}

  getHtmlOutput(): Observable<string> {
    return this.canvasService.pages$.pipe(
      map((pages: CanvasPage[]) => this.generateFullHtmlDoc(pages))
    );
  }

  private generateFullHtmlDoc(pages: CanvasPage[]): string {
    const containerStyle = `
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      background: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;
      margin: 0;
      padding: 0;
    `;

    const pageHtml = pages.map((page, idx) => {
      const pageContainerStyle = `
        position: relative;
        width: 800px;
        height: 600px;
        background: white;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
        overflow: hidden;
        margin-bottom: 32px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        border-radius: 8px;
      `;
      const elementsHtml = page.elements.map(element => {
        const baseStyles = `
          position: absolute;
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.width}px;
          height: ${element.height}px;
          transform: rotate(${element.rotation}deg);
          z-index: ${element.zIndex};
          margin: 0; padding: 0;
          box-sizing: border-box;
          overflow: hidden;
        `;
        if (element.type === 'text') {
          const textStyles = `
            ${baseStyles}
            width: ${element.width}px;
            height: ${element.height}px;
            font-size: ${element.fontSize || 16}px;
            color: ${element.color || '#000'};
            font-family: Arial, Helvetica, sans-serif;
            background: none;
            line-height: 1.2;
            text-align: left;
            white-space: pre-wrap;
            word-break: break-all;
            font-weight: normal;
            box-sizing: border-box;
            overflow: visible;
            margin: 0;
            padding: 0;
          `;
          return `<div style='${textStyles}'>${this.escapeHtml(element.text || '')}</div>`;
        } else {
          const imageStyles = `
            ${baseStyles}
            background: none;
          `;
          return `<img src='${element.imageUrl}' style='${imageStyles}object-fit:contain;display:block;border:none;background:none;' alt='Canvas image element'>`;
        }
      }).join('\n');
      return `<div class='canvas-preview' id='page-${idx}' style='${pageContainerStyle}'>${elementsHtml}</div>`;
    }).join('\n');

    // Full HTML document with all pages stacked vertically and scroll script
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>Canvas Export</title>
  <style>
    html, body {
      width: 100%;
      min-height: 100%;
      height: auto;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      overflow-y: auto;
    }
    .canvas-preview {
      position: relative;
      width: 800px;
      height: 600px;
      background: white;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;
      overflow: hidden;
      margin-bottom: 32px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      border-radius: 8px;
    }
  </style>
</head>
<body style='${containerStyle}'>
  ${pageHtml}
  <script>
    window.addEventListener('message', function(event) {
      if (event.data && typeof event.data.scrollToPage === 'number') {
        var page = document.getElementById('page-' + event.data.scrollToPage);
        if (page) {
          page.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  </script>
</body>
</html>`;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
