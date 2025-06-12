import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'rect' | 'circle' | 'line' | 'triangle' | 'star' | 'ellipse';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  fontSize?: number;
  color?: string;
  text?: string;
  imageUrl?: string;
  // Text style properties
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: string;
  textDecoration?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number;
  lineHeight?: number;
  // Shape
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  borderRadius?: number; // for rect
  points?: number[];     // for line, triangle
  numPoints?: number;    // for star
}

export interface CanvasPage {
  id: string;
  title: string;
  elements: CanvasElement[];
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private readonly STORAGE_KEY = 'canvas_pages_state';
  private pagesSubject = new BehaviorSubject<CanvasPage[]>([]);
  private currentPageIndexSubject = new BehaviorSubject<number>(0);

  private selectedElementIdSubject = new BehaviorSubject<string | null>(null);
  public selectedElementId$ = this.selectedElementIdSubject.asObservable();

  public pages$ = this.pagesSubject.asObservable();
  public currentPageIndex$ = this.currentPageIndexSubject.asObservable();

  constructor() {
    this.loadFromStorage();
    if (this.pagesSubject.value.length === 0) {
      this.addPage();
    }
  }

  private loadFromStorage(): void {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        // If old format (array), wrap in pages
        if (Array.isArray(state)) {
          this.pagesSubject.next([{ id: this.generateId(), title: 'Page 1', elements: state }]);
          this.currentPageIndexSubject.next(0);
        } else if (state.pages && Array.isArray(state.pages)) {
          this.pagesSubject.next(state.pages);
          this.currentPageIndexSubject.next(state.currentPageIndex ?? 0);
        } else {
          // fallback: initialize with one empty page
          this.pagesSubject.next([{ id: this.generateId(), title: 'Page 1', elements: [] }]);
          this.currentPageIndexSubject.next(0);
        }
      } catch {
        this.pagesSubject.next([{ id: this.generateId(), title: 'Page 1', elements: [] }]);
        this.currentPageIndexSubject.next(0);
      }
    } else {
      this.pagesSubject.next([{ id: this.generateId(), title: 'Page 1', elements: [] }]);
      this.currentPageIndexSubject.next(0);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      pages: this.pagesSubject.value,
      currentPageIndex: this.currentPageIndexSubject.value
    }));
  }

  getCurrentPage(): CanvasPage {
    return this.pagesSubject.value[this.currentPageIndexSubject.value];
  }

  getCurrentElements(): CanvasElement[] {
    return this.getCurrentPage().elements;
  }

  addPage(title: string = `Page ${this.pagesSubject.value.length + 1}`): void {
    const newPage: CanvasPage = {
      id: this.generateId(),
      title,
      elements: []
    };
    const pages = [...this.pagesSubject.value, newPage];
    this.pagesSubject.next(pages);
    this.currentPageIndexSubject.next(pages.length - 1);
    this.saveToStorage();
  }

  deletePage(index: number): void {
    let pages = [...this.pagesSubject.value];
    if (pages.length <= 1) return; // Always keep at least one page
    pages.splice(index, 1);
    let newIndex = this.currentPageIndexSubject.value;
    if (newIndex >= pages.length) newIndex = pages.length - 1;
    this.pagesSubject.next(pages);
    this.currentPageIndexSubject.next(newIndex);
    this.saveToStorage();
  }

  switchPage(index: number): void {
    if (index >= 0 && index < this.pagesSubject.value.length) {
      this.currentPageIndexSubject.next(index);
      this.saveToStorage();
    }
  }

  addElement(element: Omit<CanvasElement, 'id'>): void {
    const pages = [...this.pagesSubject.value];
    const page = { ...pages[this.currentPageIndexSubject.value] };
    const newElement: CanvasElement = {
      ...element,
      id: this.generateId()
    };
    page.elements = [...page.elements, newElement];
    pages[this.currentPageIndexSubject.value] = page;
    this.pagesSubject.next(pages);
    this.saveToStorage();
  }

  updateElement(id: string, updates: Partial<CanvasElement>): void {
    const pages = [...this.pagesSubject.value];
    const page = { ...pages[this.currentPageIndexSubject.value] };
    page.elements = page.elements.map(element =>
      element.id === id ? { ...element, ...updates } : element
    );
    pages[this.currentPageIndexSubject.value] = page;
    this.pagesSubject.next(pages);
    this.saveToStorage();
  }

  deleteElement(id: string): void {
    const pages = [...this.pagesSubject.value];
    const page = { ...pages[this.currentPageIndexSubject.value] };
    page.elements = page.elements.filter(element => element.id !== id);
    pages[this.currentPageIndexSubject.value] = page;
    this.pagesSubject.next(pages);
    this.saveToStorage();
  }

  updateZIndex(id: string, direction: 'up' | 'down'): void {
    const pages = [...this.pagesSubject.value];
    const page = { ...pages[this.currentPageIndexSubject.value] };
    const elementIndex = page.elements.findIndex(el => el.id === id);
    if (elementIndex === -1) return;
    const newElements = [...page.elements];
    if (direction === 'up' && elementIndex < newElements.length - 1) {
      [newElements[elementIndex], newElements[elementIndex + 1]] =
        [newElements[elementIndex + 1], newElements[elementIndex]];
    } else if (direction === 'down' && elementIndex > 0) {
      [newElements[elementIndex], newElements[elementIndex - 1]] =
        [newElements[elementIndex - 1], newElements[elementIndex]];
    }
    page.elements = newElements;
    pages[this.currentPageIndexSubject.value] = page;
    this.pagesSubject.next(pages);
    this.saveToStorage();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getStateAsBase64(): string {
    return btoa(JSON.stringify({
      pages: this.pagesSubject.value,
      currentPageIndex: this.currentPageIndexSubject.value
    }));
  }

  loadStateFromBase64(base64State: string): void {
    try {
      const state = JSON.parse(atob(base64State));
      this.pagesSubject.next(state.pages);
      this.currentPageIndexSubject.next(state.currentPageIndex ?? 0);
      this.saveToStorage();
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }

  getShareableState(): string {
    return JSON.stringify({
      pages: this.pagesSubject.value,
      currentPageIndex: this.currentPageIndexSubject.value
    });
  }

  loadStateFromJson(json: string): void {
    try {
      const state = JSON.parse(json);
      this.pagesSubject.next(state.pages || []);
      this.currentPageIndexSubject.next(state.currentPageIndex ?? 0);
      this.saveToStorage();
    } catch (error) {
      this.pagesSubject.next([{ id: this.generateId(), title: 'Page 1', elements: [] }]);
      this.currentPageIndexSubject.next(0);
      this.saveToStorage();
    }
  }

  setSelectedElementId(id: string | null) {
    this.selectedElementIdSubject.next(id);
  }
}
