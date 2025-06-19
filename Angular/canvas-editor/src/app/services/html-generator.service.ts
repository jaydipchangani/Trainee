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

  getSinglePageHtmlOutput(pageIndex: number): Observable<string> {
    return this.canvasService.pages$.pipe(
      map((pages: CanvasPage[]) => this.generateSinglePageHtmlDoc(pages, pageIndex))
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
        width: 1024px;
        height: 768px;
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
        } else if (element.type === 'image') {
          const imageStyles = `
            ${baseStyles}
            background: none;
          `;
          return `<img src='${element.imageUrl}' style='${imageStyles}object-fit:contain;display:block;border:none;background:none;' alt='Canvas image element'>`;
        } else if (
          element.type === 'rect' ||
          element.type === 'circle' ||
          element.type === 'ellipse' ||
          element.type === 'star' ||
          element.type === 'line' ||
          element.type === 'arrow' ||
          element.type === 'semicircle'
        ) {
          // SVG wrapper for shape
          const svgStyle = `${baseStyles} display: block;`;
          let shapeSvg = '';
          if (element.type === 'rect') {
            shapeSvg = `<rect x='0' y='0' width='${element.width}' height='${element.height}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' rx='${element.borderRadius || 0}' opacity='${element.opacity ?? 1}' />`;
          } else if (element.type === 'circle') {
            const r = (element.width || 80) / 2;
            shapeSvg = `<circle cx='${r}' cy='${r}' r='${r}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
          } else if (element.type === 'ellipse') {
            const rx = (element.width || 80) / 2;
            const ry = (element.height || 80) / 2;
            shapeSvg = `<ellipse cx='${rx}' cy='${ry}' rx='${rx}' ry='${ry}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
          } else if (element.type === 'star') {
            // Star SVG path generator
            const numPoints = element.numPoints || 5;
            const outerRadius = (element.width || 100) / 2;
            const innerRadius = outerRadius / 2;
            const cx = outerRadius, cy = outerRadius;
            let path = '';
            for (let i = 0; i < numPoints * 2; i++) {
              const angle = (Math.PI / numPoints) * i;
              const r = i % 2 === 0 ? outerRadius : innerRadius;
              const x = cx + Math.cos(angle - Math.PI / 2) * r;
              const y = cy + Math.sin(angle - Math.PI / 2) * r;
              path += i === 0 ? `M${x},${y}` : `L${x},${y}`;
            }
            path += 'Z';
            shapeSvg = `<path d='${path}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
          } else if (element.type === 'line') {
            const points = element.points || [0, 0, 100, 0];
            const bbox = this.getPointsBoundingBox(points);
            const [x1, y1, x2, y2] = [
              points[0] - bbox.minX,
              points[1] - bbox.minY,
              points[2] - bbox.minX,
              points[3] - bbox.minY
            ];
            shapeSvg = `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
          } else if (element.type === 'arrow') {
            const points = element.points || [0, 0, 100, 0];
            const arrowLength = 20;
            const arrowAngle = Math.PI / 6; // 30 degrees
            // Calculate arrowhead points
            const endX = points[points.length - 2];
            const endY = points[points.length - 1];
            const startX = points[points.length - 4];
            const startY = points[points.length - 3];
            const angle = Math.atan2(endY - startY, endX - startX);
            const arrow1X = endX - arrowLength * Math.cos(angle - arrowAngle);
            const arrow1Y = endY - arrowLength * Math.sin(angle - arrowAngle);
            const arrow2X = endX - arrowLength * Math.cos(angle + arrowAngle);
            const arrow2Y = endY - arrowLength * Math.sin(angle + arrowAngle);
            const arrowPoints = [...points, arrow1X, arrow1Y, endX, endY, arrow2X, arrow2Y];
            const bbox = this.getPointsBoundingBox(arrowPoints);
            // Normalize all points
            const normPoints = arrowPoints.map((p, i) => (i % 2 === 0 ? p - bbox.minX : p - bbox.minY));
            // For path, use M for first, L for rest
            let pathData = '';
            for (let i = 0; i < normPoints.length; i += 2) {
              pathData += (i === 0 ? 'M' : 'L') + normPoints[i] + ' ' + normPoints[i + 1] + ' ';
            }
            shapeSvg = `<path d='${pathData.trim()}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' fill='none' opacity='${element.opacity ?? 1}' />`;
          } else if (element.type === 'semicircle') {
            const radius = (element.width || 100) / 2;
            const cx = radius;
            const cy = radius;
            shapeSvg = `<path d='M${cx - radius},${cy} A${radius},${radius} 0 0,1 ${cx + radius},${cy}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
          }
          return `<svg width='${element.width}' height='${element.height}' style='${svgStyle}' xmlns='http://www.w3.org/2000/svg'>${shapeSvg}</svg>`;
        }
        // Default return for any other element type
        return '';
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
      border-radius: 0px;
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

  private generateSinglePageHtmlDoc(pages: CanvasPage[], pageIndex: number): string {
    const containerStyle = `
      width: 1920px;
      height: 1080px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: white;
    `;

    const page = pages[pageIndex];
    if (!page) return '';

    const pageContainerStyle = `
      position: relative;
      width: 1920px;
      height: 1080px;
      background: white;
      overflow: hidden;
      margin: 0;
      padding: 0;
    `;

    const elementsHtml = page.elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .map(element => this.generateElementHtml(element))
      .join('\n');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>Canvas Export</title>
  <style>
    html, body {
      width: 1920px;
      height: 1080px;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    .canvas-preview {
      width: 1920px;
      height: 1080px;
      background: white;
      position: relative;
      overflow: hidden;
    }
  </style>
</head>
<body style='${containerStyle}'>
  <div class='canvas-preview'>
    ${elementsHtml}
  </div>
</body>
</html>`;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private getPointsBoundingBox(points: number[]): { minX: number; minY: number; maxX: number; maxY: number } {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    return { minX, minY, maxX, maxY };
  }

  private generateElementHtml(element: CanvasElement): string {
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
    } else if (element.type === 'image') {
      const imageStyles = `
        ${baseStyles}
        background: none;
      `;
      return `<img src='${element.imageUrl}' style='${imageStyles}object-fit:contain;display:block;border:none;background:none;' alt='Canvas image element'>`;
    } else if (
      element.type === 'rect' ||
      element.type === 'circle' ||
      element.type === 'ellipse' ||
      element.type === 'star' ||
      element.type === 'line' ||
      element.type === 'arrow' ||
      element.type === 'semicircle'
    ) {
      const svgStyle = `${baseStyles} display: block;`;
      let shapeSvg = '';
      if (element.type === 'rect') {
        shapeSvg = `<rect x='0' y='0' width='${element.width}' height='${element.height}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' rx='${element.borderRadius || 0}' opacity='${element.opacity ?? 1}' />`;
      } else if (element.type === 'circle') {
        const r = (element.width || 80) / 2;
        shapeSvg = `<circle cx='${r}' cy='${r}' r='${r}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
      } else if (element.type === 'ellipse') {
        const rx = (element.width || 80) / 2;
        const ry = (element.height || 80) / 2;
        shapeSvg = `<ellipse cx='${rx}' cy='${ry}' rx='${rx}' ry='${ry}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
      } else if (element.type === 'star') {
        const numPoints = element.numPoints || 5;
        const outerRadius = (element.width || 100) / 2;
        const innerRadius = outerRadius / 2;
        const cx = outerRadius, cy = outerRadius;
        let path = '';
        for (let i = 0; i < numPoints * 2; i++) {
          const angle = (Math.PI / numPoints) * i;
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const x = cx + Math.cos(angle - Math.PI / 2) * r;
          const y = cy + Math.sin(angle - Math.PI / 2) * r;
          path += i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }
        path += 'Z';
        shapeSvg = `<path d='${path}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
      } else if (element.type === 'line') {
        const points = element.points || [0, 0, 100, 0];
        const bbox = this.getPointsBoundingBox(points);
        const [x1, y1, x2, y2] = [
          points[0] - bbox.minX,
          points[1] - bbox.minY,
          points[2] - bbox.minX,
          points[3] - bbox.minY
        ];
        shapeSvg = `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
      } else if (element.type === 'arrow') {
        const points = element.points || [0, 0, 100, 0];
        const arrowLength = 20;
        const arrowAngle = Math.PI / 6;
        const endX = points[points.length - 2];
        const endY = points[points.length - 1];
        const startX = points[points.length - 4];
        const startY = points[points.length - 3];
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrow1X = endX - arrowLength * Math.cos(angle - arrowAngle);
        const arrow1Y = endY - arrowLength * Math.sin(angle - arrowAngle);
        const arrow2X = endX - arrowLength * Math.cos(angle + arrowAngle);
        const arrow2Y = endY - arrowLength * Math.sin(angle + arrowAngle);
        const arrowPoints = [...points, arrow1X, arrow1Y, endX, endY, arrow2X, arrow2Y];
        const bbox = this.getPointsBoundingBox(arrowPoints);
        const normPoints = arrowPoints.map((p, i) => (i % 2 === 0 ? p - bbox.minX : p - bbox.minY));
        let pathData = '';
        for (let i = 0; i < normPoints.length; i += 2) {
          pathData += (i === 0 ? 'M' : 'L') + normPoints[i] + ' ' + normPoints[i + 1] + ' ';
        }
        shapeSvg = `<path d='${pathData.trim()}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' fill='none' opacity='${element.opacity ?? 1}' />`;
      } else if (element.type === 'semicircle') {
        const radius = (element.width || 100) / 2;
        const cx = radius;
        const cy = radius;
        shapeSvg = `<path d='M${cx - radius},${cy} A${radius},${radius} 0 0,1 ${cx + radius},${cy}' fill='${element.fill}' stroke='${element.stroke}' stroke-width='${element.strokeWidth}' opacity='${element.opacity ?? 1}' />`;
      }
      return `<svg width='${element.width}' height='${element.height}' style='${svgStyle}' xmlns='http://www.w3.org/2000/svg'>${shapeSvg}</svg>`;
    }
    return '';
  }
}
