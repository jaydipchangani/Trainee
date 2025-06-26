import { CanvasElement } from '../../services/canvas.service';

export interface HtmlToCanvasOptions {
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

/**
 * Parses raw HTML and converts it to an array of CanvasElement objects.
 * Only supports <h1>, <h2>, <h3>, <p>, <div> with inline styles for now.
 * Can be extended for more tags.
 */
export function htmlToCanvasElements(html: string, opts: HtmlToCanvasOptions = {}): CanvasElement[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstChild as HTMLElement;
  if (!root) return [];

  // Defaults
  const { defaultX = 100, defaultY = 100, defaultWidth = 300, defaultHeight = 60 } = opts;
  let yOffset = defaultY;
  const elements: CanvasElement[] = [];

  function extractStyles(el: HTMLElement) {
    const style = el.style;
    // Parse border (e.g., '1px solid #000')
    let borderWidth, borderStyle, borderColor;
    if (style.border) {
      const borderParts = style.border.split(' ');
      borderWidth = borderParts[0] ? parseInt(borderParts[0]) : undefined;
      borderStyle = borderParts[1] || undefined;
      borderColor = borderParts[2] || undefined;
    }
    return {
      fontSize: style.fontSize ? parseInt(style.fontSize) : undefined,
      color: style.color || undefined,
      fontWeight: style.fontWeight || undefined,
      fontStyle: style.fontStyle || undefined,
      textDecoration: style.textDecoration || undefined,
      fontFamily: style.fontFamily || undefined,
      background: style.backgroundColor || undefined,
      borderRadius: style.borderRadius ? parseInt(style.borderRadius) : undefined,
      border: style.border || undefined,
      borderWidth,
      borderStyle,
      borderColor,
      padding: style.padding ? parseInt(style.padding) : undefined,
      textAlign: style.textAlign || undefined,
      lineHeight: style.lineHeight ? parseFloat(style.lineHeight) : undefined,
      letterSpacing: style.letterSpacing ? parseFloat(style.letterSpacing) : undefined,
    };
  }

  function handleNode(node: HTMLElement) {
    const tag = node.tagName.toLowerCase();
    const styles = extractStyles(node);
    let element: CanvasElement | null = null;
    let width = defaultWidth;
    let height = defaultHeight;
    let text = node.innerText;

    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p') {
      // Text node
      element = {
        id: Date.now().toString() + Math.random(),
        type: 'text',
        x: defaultX,
        y: yOffset,
        width,
        height,
        rotation: 0,
        zIndex: 0,
        text: text,
        fontSize: styles.fontSize || (tag === 'h1' ? 32 : tag === 'h2' ? 28 : tag === 'h3' ? 24 : 18),
        color: styles.color || '#222',
        fontWeight: styles.fontWeight || (tag === 'h1' ? 'bold' : 'normal'),
        fontStyle: styles.fontStyle || 'normal',
        textDecoration: styles.textDecoration || 'none',
        fontFamily: styles.fontFamily || 'Arial',
        align: styles.textAlign || 'left',
        letterSpacing: styles.letterSpacing !== undefined ? styles.letterSpacing : 0,
        lineHeight: styles.lineHeight !== undefined ? styles.lineHeight : 1.5,
        locked: false
      } as CanvasElement;
      yOffset += (element.fontSize || 18) + 30;
    } else if (tag === 'div') {
      // Rectangle node
      element = {
        id: Date.now().toString() + Math.random(),
        type: 'rect',
        x: defaultX,
        y: yOffset,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 0,
        fill: styles.background || '#e0e0e0',
        stroke: styles.borderColor || (styles.border ? styles.border.split(' ')[2] || '#888' : '#888'),
        strokeWidth: styles.borderWidth !== undefined ? styles.borderWidth : (styles.border ? parseInt(styles.border.split(' ')[0]) || 1 : 1),
        opacity: 1,
        borderRadius: styles.borderRadius || 0,
        locked: false,
        visible: true
      } as CanvasElement;
      yOffset += height + 20;
    }
    if (element) {
      elements.push(element);
    }
  }

  // Only top-level children
  Array.from(root.childNodes).forEach((node: any) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      handleNode(node as HTMLElement);
    }
  });

  return elements;
}
