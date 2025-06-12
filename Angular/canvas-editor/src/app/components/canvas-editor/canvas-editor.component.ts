import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasService, CanvasElement, CanvasPage } from '../../services/canvas.service';
import Konva from 'konva';

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.scss']
})
export class CanvasEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChildren('container') canvasContainers!: QueryList<ElementRef>;
  @ViewChildren('canvasPageWrapper') canvasPageWrappers!: QueryList<ElementRef>;

  public selectedId: string | null = null;
  public selectedPageIndex: number = 0;
  showAddTextModal = false;
  showAddImageModal = false;
  newText = '';
  newImageUrl = '';
  fontSize = 16;
  textColor = '#000000';

  pages: CanvasPage[] = [];

  // Store a Konva.Stage for each page
  private stages: Konva.Stage[] = [];
  private layers: Konva.Layer[] = [];
  private transformers: Konva.Transformer[] = [];

  editingPageIndexMap: { [key: number]: boolean } = {};

  fileName = 'Untitled Design';
  isEditingFileName = false;
  canUndo = false;
  canRedo = false;

  private historyStack: any[] = [];
  private redoStack: any[] = [];

  constructor(
    private canvasService: CanvasService,
    private router: Router
  ) {
    // Load fileName from URL if present
    const urlFileName = this.getFileNameFromUrl();
    if (urlFileName) this.fileName = urlFileName;
  }

  ngOnInit() {
    this.canvasService.pages$.subscribe(pages => {
      this.pages = pages;
      setTimeout(() => this.initAllCanvases());
      this.pushHistory();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initAllCanvases());
  }

  private initAllCanvases() {
    if (!this.canvasContainers) return;
    this.stages = [];
    this.layers = [];
    this.transformers = [];
    this.canvasContainers.forEach((containerRef, i) => {
      const container = containerRef.nativeElement;
      // Remove previous stage if any
      while (container.firstChild) container.removeChild(container.firstChild);
      const stage = new Konva.Stage({
        container: container,
        width: 800,
        height: 600
      });
      const layer = new Konva.Layer();
      stage.add(layer);
      const transformer = new Konva.Transformer({
        nodes: [],
        rotateEnabled: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
      });
      layer.add(transformer);
      this.stages[i] = stage;
      this.layers[i] = layer;
      this.transformers[i] = transformer;
      this.loadElementsForPage(i);
    });
  }

  private loadElementsForPage(pageIndex: number) {
    const elements = this.pages[pageIndex]?.elements || [];
    const layer = this.layers[pageIndex];
    const transformer = this.transformers[pageIndex];
    if (!layer || !transformer) return;
    layer.destroyChildren();
    layer.add(transformer);
    elements.forEach(element => {
      const node = this.createElementNode(element, pageIndex);
      if (node) {
        layer.add(node);
      }
    });
    layer.draw();
  }

  private createElementNode(element: CanvasElement, pageIndex: number): Konva.Shape | null {
    let node: Konva.Shape;
    if (element.type === 'text') {
      node = new Konva.Text({
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        text: element.text || '',
        fontSize: element.fontSize,
        fill: element.color,
        draggable: true
      });
    } else {
      const image = new Image();
      image.src = element.imageUrl || '';
      node = new Konva.Image({
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        image: image,
        draggable: true
      });
    }
    node.on('transformend', () => {
      const updatedElement = {
        x: node.x(),
        y: node.y(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
        rotation: node.rotation()
      };
      this.updateElementOnPage(element.id, updatedElement, pageIndex);
      node.scaleX(1);
      node.scaleY(1);
    });
    node.on('dragend', () => {
      this.updateElementOnPage(element.id, {
        x: node.x(),
        y: node.y()
      }, pageIndex);
    });
    node.on('click', () => {
      this.selectedId = element.id;
      this.transformers[pageIndex].nodes([node]);
      this.layers[pageIndex].draw();
      this.selectedPageIndex = pageIndex;
    });
    return node;
  }

  addText() {
    if (this.pages.length === 0) return;
    const currentElements = this.pages[this.selectedPageIndex].elements;
    const element: Omit<CanvasElement, 'id'> = {
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: currentElements.length,
      text: this.newText,
      fontSize: this.fontSize,
      color: this.textColor
    };
    this.canvasService.switchPage(this.selectedPageIndex);
    this.canvasService.addElement(element);
    this.showAddTextModal = false;
    this.newText = '';
    setTimeout(() => this.initAllCanvases());
  }

  addImage() {
    if (this.pages.length === 0) return;
    const currentElements = this.pages[this.selectedPageIndex].elements;
    const element: Omit<CanvasElement, 'id'> = {
      type: 'image',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: currentElements.length,
      imageUrl: this.newImageUrl
    };
    this.canvasService.switchPage(this.selectedPageIndex);
    this.canvasService.addElement(element);
    this.showAddImageModal = false;
    this.newImageUrl = '';
    setTimeout(() => this.initAllCanvases());
  }

  deleteSelected() {
    if (this.selectedId) {
      this.canvasService.deleteElement(this.selectedId);
      this.selectedId = null;
      this.initAllCanvases();
    }
  }

  bringForward() {
    if (this.selectedId) {
      this.canvasService.updateZIndex(this.selectedId, 'up');
      this.initAllCanvases();
    }
  }

  sendBackward() {
    if (this.selectedId) {
      this.canvasService.updateZIndex(this.selectedId, 'down');
      this.initAllCanvases();
    }
  }

  shareDesign() {
    const key = 'design-' + Math.random().toString(36).substr(2, 9);
    const state = this.canvasService.getShareableState();
    localStorage.setItem(key, state);
    const shareUrl = `${window.location.origin}/view/${key}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  }

  addPage() {
    this.canvasService.addPage();
    setTimeout(() => {
      this.selectedPageIndex = this.pages.length - 1;
      this.scrollToPage(this.selectedPageIndex);
    });
  }

  scrollToPage(index: number) {
    if (!this.canvasPageWrappers) return;
    const wrapper = this.canvasPageWrappers.toArray()[index]?.nativeElement;
    if (wrapper) {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.selectedPageIndex = index;
    }
  }

  onPageClick(index: number) {
    this.selectedPageIndex = index;
  }

  private updateElementOnPage(id: string, updates: Partial<CanvasElement>, pageIndex: number) {
    if (pageIndex === this.selectedPageIndex) {
      this.canvasService.switchPage(pageIndex);
      this.canvasService.updateElement(id, updates);
    }
  }

  deletePage(index: number) {
    if (this.pages.length === 1) return;
    this.canvasService.deletePage(index);
    if (this.selectedPageIndex >= this.pages.length - 1) {
      this.selectedPageIndex = Math.max(0, this.pages.length - 2);
    }
    setTimeout(() => this.initAllCanvases());
  }

  editPageName(index: number) {
    this.editingPageIndexMap[index] = true;
    setTimeout(() => {
      const input = document.querySelector('.page-title-input') as HTMLInputElement;
      if (input) input.focus();
    });
  }

  stopEditingPageName(index: number) {
    this.editingPageIndexMap[index] = false;
    // Optionally, persist the new title to the service/localStorage here if needed
  }

  // Undo/Redo logic
  undo() {
    if (this.historyStack.length > 1) {
      const current = this.historyStack.pop();
      if (current) this.redoStack.push(current);
      const prev = this.historyStack[this.historyStack.length - 1];
      if (prev) {
        this.canvasService.loadStateFromJson(JSON.stringify(prev));
      }
      this.updateUndoRedoState();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const next = this.redoStack.pop();
      if (next) {
        this.canvasService.loadStateFromJson(JSON.stringify(next));
        this.historyStack.push(next);
      }
      this.updateUndoRedoState();
    }
  }

  private pushHistory() {
    const state = {
      pages: JSON.parse(JSON.stringify(this.pages)),
      currentPageIndex: this.selectedPageIndex
    };
    if (!this.historyStack.length || JSON.stringify(this.historyStack[this.historyStack.length - 1]) !== JSON.stringify(state)) {
      this.historyStack.push(state);
      if (this.historyStack.length > 50) this.historyStack.shift();
      this.redoStack = [];
    }
    this.updateUndoRedoState();
  }

  private updateUndoRedoState() {
    this.canUndo = this.historyStack.length > 1;
    this.canRedo = this.redoStack.length > 0;
  }

  onFileNameChange() {
    this.isEditingFileName = false;
    this.updateUrlWithFileName();
  }

  updateUrlWithFileName() {
    const encoded = encodeURIComponent(this.fileName.trim());
    this.router.navigateByUrl(`/edit/${encoded}`);
  }

  getFileNameFromUrl(): string | null {
    const match = window.location.pathname.match(/\/edit\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  share() {
    // Save state to localStorage and copy /view/{key} URL for HTML preview
    const key = 'design-' + Math.random().toString(36).substr(2, 9);
    const state = this.canvasService.getShareableState();
    localStorage.setItem(key, state);
    const url = `${window.location.origin}/view/${key}`;
    navigator.clipboard.writeText(url);
    alert('Shareable link copied!');
  }
}
