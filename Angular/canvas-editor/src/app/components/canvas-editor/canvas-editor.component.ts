import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasService, CanvasElement, CanvasPage } from '../../services/canvas.service';
import Konva from 'konva';
import { TemplateService, CanvasTemplate } from '../../services/template.service';

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.scss']
})
export class CanvasEditorComponent implements OnInit, AfterViewInit, OnDestroy {
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

  activeSection: string | null = null;

  private editingTextId: string | null = null;

  // Floating text toolbar state
  public textToolbarVisible = false;
  public textToolbarElement: CanvasElement | null = null;
  public fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Tahoma'];
  public alignments = ['left', 'center', 'right', 'justify'];

  shapeFillColor: string = '#cccccc';
  shapeStrokeColor: string = '#000000';

  shapeToolbarVisible: boolean = false;
  shapeToolbarElement: CanvasElement | null = null;

  uploadedFiles: { url: string; type: string }[] = [];

  lockAspectRatio: boolean = true;

  constructor(
    private canvasService: CanvasService,
    private router: Router,
    private templateService: TemplateService
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
    // Subscribe to selection changes
    this.canvasService.selectedElementId$.subscribe(selectedId => {
      this.selectedId = selectedId;
      // Update transformer highlight
      setTimeout(() => {
        if (selectedId && this.selectedPageIndex < this.transformers.length) {
          const layer = this.layers[this.selectedPageIndex];
          const transformer = this.transformers[this.selectedPageIndex];
          const node = layer?.findOne(`#${selectedId}`);
          if (node) {
            transformer.nodes([node]);
            layer.draw();
          } else {
            transformer.nodes([]);
            layer.draw();
          }
        }
      });
      // Show/hide text toolbar
      if (selectedId) {
        const el = this.pages[this.selectedPageIndex]?.elements.find(e => e.id === selectedId && e.type === 'text');
        this.textToolbarElement = el ? { ...el } : null;
        this.textToolbarVisible = !!el;
      } else {
        this.textToolbarElement = null;
        this.textToolbarVisible = false;
      }
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
        rotateEnabled: true, // Enable rotation handle
        enabledAnchors: [
          'top-left', 'top-center', 'top-right',
          'middle-left', 'middle-right',
          'bottom-left', 'bottom-center', 'bottom-right'
        ], // Enable all resize handles
        borderStroke: '#1976d2',
        borderStrokeWidth: 2,
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
    elements.forEach(element => {
      const node = this.createElementNode(element, pageIndex);
      if (node !== null) {
        layer.add(node);
      }
    });
    // Always add transformer last so it appears above all nodes
    layer.add(transformer);
    layer.draw();
  }

  private createElementNode(element: CanvasElement, pageIndex: number): Konva.Shape | null {
    let node: Konva.Shape | null = null;
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
        draggable: true,
        fontFamily: element.fontFamily || 'Arial',
        fontStyle: element.fontStyle || 'normal',
        fontWeight: element.fontWeight || 'normal',
        textDecoration: element.textDecoration || '',
        align: element.align || 'left',
        letterSpacing: element.letterSpacing || 0,
        lineHeight: element.lineHeight || 1.2
      });
      // Add click handler for selection and toolbar
      node.on('click', () => {
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        if (this.transformers[pageIndex] && node) {
          this.transformers[pageIndex].nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
      // Double-click to edit
      node.on('dblclick dbltap', () => {
        if (this.editingTextId) return;
        this.editingTextId = element.id;
        const stage = this.stages[pageIndex];
        if (!node) return;
        const absPos = node.getAbsolutePosition();
        const containerRect = stage.container().getBoundingClientRect();
        const areaPosition = {
          x: containerRect.left + absPos.x,
          y: containerRect.top + absPos.y
        };
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.value = (node as Konva.Text).text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = (node ? node.width() : 0) + 'px';
        textarea.style.height = (node ? node.height() : 0) + 'px';
        textarea.style.fontSize = (node as Konva.Text).fontSize() + 'px';
        textarea.style.fontFamily = 'inherit';
        textarea.style.color = (node as Konva.Text).fill() as string;
        textarea.style.background = 'rgba(255,255,255,0.9)';
        textarea.style.border = '1px solid #1976d2';
        textarea.style.padding = '2px 4px';
        textarea.style.margin = '0';
        textarea.style.overflow = 'hidden';
        textarea.style.resize = 'none';
        textarea.style.zIndex = '9999';
        textarea.focus();
        textarea.select();
        let isSaved = false;
        const removeTextarea = () => {
          if (document.body.contains(textarea)) {
            document.body.removeChild(textarea);
          }
          this.editingTextId = null;
        };
        const finish = () => {
          if (isSaved) return;
          isSaved = true;
          const newText = textarea.value;
          (node as Konva.Text).text(newText);
          this.updateElementOnPage(element.id, { text: newText }, pageIndex);
          removeTextarea();
          // Deselect after editing
          this.canvasService.setSelectedElementId(null);
        };
        textarea.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            finish();
          } else if (e.key === 'Escape') {
            removeTextarea();
            this.canvasService.setSelectedElementId(null);
          }
        });
        textarea.addEventListener('blur', () => setTimeout(finish, 100));
      });
    } else if (element.type === 'rect') {
      node = new Konva.Rect({
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        opacity: element.opacity,
        cornerRadius: element.borderRadius || 0,
        draggable: true
      });
      node.on('click', () => {
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        if (this.transformers[pageIndex] && node) {
          this.transformers[pageIndex].nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
    } else if (element.type === 'circle') {
      node = new Konva.Circle({
        id: element.id,
        x: element.x + (element.width || 80) / 2,
        y: element.y + (element.height || 80) / 2,
        radius: (element.width || 80) / 2,
        rotation: element.rotation,
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        opacity: element.opacity,
        draggable: true
      });
      node.on('click', () => {
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        if (this.transformers[pageIndex] && node) {
          this.transformers[pageIndex].nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
    } else if (element.type === 'ellipse') {
      node = new Konva.Ellipse({
        id: element.id,
        x: element.x + (element.width || 80) / 2,
        y: element.y + (element.height || 80) / 2,
        radiusX: (element.width || 80) / 2,
        radiusY: (element.height || 80) / 2,
        rotation: element.rotation,
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        opacity: element.opacity,
        draggable: true
      });
      node.on('click', () => {
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        if (this.transformers[pageIndex] && node) {
          this.transformers[pageIndex].nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
    } else if (element.type === 'line') {
      node = new Konva.Line({
        id: element.id,
        points: element.points || [0, 0, 100, 0],
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        opacity: element.opacity,
        rotation: element.rotation,
        lineCap: 'round',
        lineJoin: 'round',
        draggable: true
      });
      node.on('click', () => {
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        if (this.transformers[pageIndex] && node) {
          this.transformers[pageIndex].nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
    } else if (element.type === 'triangle') {
      node = new Konva.Line({
        id: element.id,
        points: element.points || [0, 0, 100, 0, 50, 100],
        closed: true,
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        opacity: element.opacity,
        rotation: element.rotation,
        draggable: true
      });
      node.on('click', () => {
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        if (this.transformers[pageIndex] && node) {
          this.transformers[pageIndex].nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
    } else if (element.type === 'star') {
      node = new Konva.Star({
        id: element.id,
        x: element.x + (element.width || 100) / 2,
        y: element.y + (element.height || 100) / 2,
        numPoints: element.numPoints || 5,
        innerRadius: (element.width || 100) / 4,
        outerRadius: (element.width || 100) / 2,
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        opacity: element.opacity,
        rotation: element.rotation,
        draggable: true
      });
      node.on('click', () => {
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        if (this.transformers[pageIndex] && node) {
          this.transformers[pageIndex].nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
    } else if (element.type === 'image' || element.type === 'video') {
      let imageOrVideo: HTMLImageElement | HTMLVideoElement;
      if (element.type === 'image') {
        imageOrVideo = new window.Image();
        (imageOrVideo as HTMLImageElement).src = element.imageUrl || '';
      } else {
        imageOrVideo = document.createElement('video');
        (imageOrVideo as HTMLVideoElement).src = element.videoUrl || '';
        (imageOrVideo as HTMLVideoElement).controls = true;
        (imageOrVideo as HTMLVideoElement).autoplay = false;
        (imageOrVideo as HTMLVideoElement).loop = true;
      }
      node = new Konva.Image({
        id: element.id,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        image: imageOrVideo,
        draggable: true
      });

      // Ensure the node is listening for pointer events
      node.listening(true);

      node.on('mousedown touchstart', (e) => {
        e.cancelBubble = true; // Prevent stage deselection
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);

        // Update transformer for this page
        const transformer = this.transformers[pageIndex];
        if (transformer && node) {
          transformer.nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
    } else {
      return null;
    }
    if (!node) return null;
    node.on('transformend', () => {
      const n = node!;
      // For images and videos, update width/height and reset scale
      if (element.type === 'image' || element.type === 'video') {
        const width = n.width() * n.scaleX();
        const height = n.height() * n.scaleY();
        n.width(width);
        n.height(height);
        n.scaleX(1);
        n.scaleY(1);
        this.updateElementOnPage(element.id, {
          x: n.x(),
          y: n.y(),
          width,
          height,
          rotation: n.rotation()
        }, pageIndex);
      } else {
        const updatedElement = {
          x: n.x(),
          y: n.y(),
          width: n.width() * n.scaleX(),
          height: n.height() * n.scaleY(),
          rotation: n.rotation()
        };
        this.updateElementOnPage(element.id, updatedElement, pageIndex);
        n.scaleX(1);
        n.scaleY(1);
      }
    });
    node.on('dragend', () => {
      const n = node!;
      this.updateElementOnPage(element.id, {
        x: n.x(),
        y: n.y()
      }, pageIndex);
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

  addImage(url: string) {
    const img = new Image();
    img.onload = () => {
      const element: CanvasElement = {
        id: Date.now().toString(),
        type: 'image',
        x: 100,
        y: 100,
        width: img.width,
        height: img.height,
        rotation: 0,
        zIndex: this.pages[this.selectedPageIndex].elements.length,
        imageUrl: url,
        lockAspectRatio: this.lockAspectRatio,
        originalWidth: img.width,
        originalHeight: img.height,
        scaleX: 1,
        scaleY: 1
      };
      this.canvasService.addElement(element);
      this.initMediaElement(element);
    };
    img.src = url;
  }

  addVideo(url: string) {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      const element: CanvasElement = {
        id: Date.now().toString(),
        type: 'video',
        x: 100,
        y: 100,
        width: video.videoWidth,
        height: video.videoHeight,
        rotation: 0,
        zIndex: this.pages[this.selectedPageIndex].elements.length,
        videoUrl: url,
        lockAspectRatio: this.lockAspectRatio,
        originalWidth: video.videoWidth,
        originalHeight: video.videoHeight,
        scaleX: 1,
        scaleY: 1
      };
      this.canvasService.addElement(element);
      this.initMediaElement(element);
    };
    video.src = url;
  }

  initMediaElement(element: CanvasElement) {
    const stage = this.stages[this.selectedPageIndex];
    const layer = stage.findOne('.layer') as Konva.Layer;
    if (!layer) return;

    let konvaNode: Konva.Image | null = null;
    if (element.type === 'image') {
      const image = new Image();
      image.src = element.imageUrl!;
      konvaNode = new Konva.Image({
        id: element.id,
        image: image,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        draggable: true
      });
    } else if (element.type === 'video') {
      const video = document.createElement('video');
      video.src = element.videoUrl!;
      video.controls = true;
      video.autoplay = false;
      video.loop = true;
      konvaNode = new Konva.Image({
        id: element.id,
        image: video,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        draggable: true
      });
    }

    if (konvaNode) {
      layer.add(konvaNode);
      this.initTransformer(element);
      layer.draw();
    }
  }

  initTransformer(element: CanvasElement) {
    const stage = this.stages[this.selectedPageIndex];
    const layer = stage.findOne('.layer') as Konva.Layer;
    if (!layer) return;

    // Remove existing transformers
    layer.find('Transformer').forEach(t => t.destroy());

    const node = layer.findOne(`#${element.id}`);
    if (!node) return;

    const transformer = new Konva.Transformer({
      nodes: [],
      rotateEnabled: true,
      enabledAnchors: [
        'top-left', 'top-center', 'top-right',
        'middle-left', 'middle-right',
        'bottom-left', 'bottom-center', 'bottom-right'
      ],
      anchorStroke: '#fff',
      anchorFill: '#fff',
      anchorSize: 10,
      anchorCornerRadius: 5,
      anchorStrokeWidth: 2,
      anchorShadowEnabled: true,
      anchorShadowColor: '#a259ff',
      anchorShadowBlur: 4,
      borderStroke: '#1976d2',
      borderStrokeWidth: 2,
      
    });

    transformer.on('transformend', () => {
      const node = transformer.nodes()[0];
      const currentElement = this.pages[this.selectedPageIndex].elements.find(e => e.id === element.id);
      if (currentElement) {
        this.canvasService.updateElement(currentElement.id, {
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY()
        });
      }
    });

    layer.add(transformer);
    layer.draw();
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
  }

  private updateElementOnPage(id: string, updates: Partial<CanvasElement>, pageIndex: number) {
    if (pageIndex === this.selectedPageIndex) {
      this.canvasService.switchPage(pageIndex);
      this.canvasService.updateElement(id, updates);
    }
  }

  getFileNameFromUrl(): string | null {
    const match = window.location.pathname.match(/\/edit\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : null;
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

  share() {
    // Save state to localStorage and copy /view/{key} URL for HTML preview
    const key = 'design-' + Math.random().toString(36).substr(2, 9);
    const state = this.canvasService.getShareableState();
    localStorage.setItem(key, state);
    const url = `${window.location.origin}/view/${key}`;
    navigator.clipboard.writeText(url);
    alert('Shareable link copied!');
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

  public updateTextElement(changes: Partial<CanvasElement>) {
    if (!this.selectedId) return;
    this.canvasService.updateElement(this.selectedId, changes);
    // Update local toolbar state for instant UI feedback
    if (this.textToolbarElement) {
      Object.assign(this.textToolbarElement, changes);
    }
    setTimeout(() => this.initAllCanvases());
  }

  public toggleBold() {
    if (!this.textToolbarElement) return;
    const isBold = this.textToolbarElement.fontWeight === 'bold';
    this.updateTextElement({ fontWeight: isBold ? 'normal' : 'bold' });
  }
  public toggleItalic() {
    if (!this.textToolbarElement) return;
    const isItalic = this.textToolbarElement.fontStyle === 'italic';
    this.updateTextElement({ fontStyle: isItalic ? 'normal' : 'italic' });
  }
  public toggleUnderline() {
    if (!this.textToolbarElement) return;
    const isUnderline = this.textToolbarElement.textDecoration === 'underline';
    this.updateTextElement({ textDecoration: isUnderline ? 'none' : 'underline' });
  }

  public addHeading() {
    this.addPresetText('Heading', 36, 'bold');
  }
  public addSubheading() {
    this.addPresetText('Subheading', 24, 'normal');
  }
  public addBodyText() {
    this.addPresetText('Body text', 16, 'normal');
  }

  private addPresetText(text: string, fontSize: number, fontStyle: 'normal' | 'bold') {
    if (this.pages.length === 0) return;
    const currentElements = this.pages[this.selectedPageIndex].elements;
    const width = 400;
    const height = fontSize + 20;
    const x = 200; // Centered for 800px canvas
    const y = 300 - height / 2;
    const element: Omit<CanvasElement, 'id'> = {
      type: 'text',
      x,
      y,
      width,
      height,
      rotation: 0,
      zIndex: currentElements.length,
      text,
      fontSize,
      color: '#222',
      fontStyle: fontStyle
    };
    this.canvasService.switchPage(this.selectedPageIndex);
    this.canvasService.addElement(element);
    setTimeout(() => this.initAllCanvases());
  }

  public addShape(type: 'rect' | 'circle' | 'ellipse' | 'star') {
    const element: CanvasElement = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: this.pages[this.selectedPageIndex].elements.length,
      fill: this.shapeFillColor,
      stroke: this.shapeStrokeColor,
      strokeWidth: 1,
      opacity: 1,
      borderRadius: 0,
      numPoints: 5,
      points: [0, 0, 100, 0, 50, 100],
    };
    this.canvasService.switchPage(this.selectedPageIndex);
    this.canvasService.addElement(element);
    setTimeout(() => this.initAllCanvases());
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  onShapeSelect(element: CanvasElement) {
    this.shapeToolbarVisible = true;
    this.shapeToolbarElement = element;
    this.initTransformer(element);
  }

  toggleAspectRatio() {
    this.lockAspectRatio = !this.lockAspectRatio;
    if (this.shapeToolbarElement) {
      this.canvasService.updateElement(this.shapeToolbarElement.id, {
        lockAspectRatio: this.lockAspectRatio
      });
    }
  }

  updateShapeElement(updates: Partial<CanvasElement>) {
    if (this.shapeToolbarElement) {
      this.canvasService.updateElement(this.shapeToolbarElement.id, updates);
    }
  }

  onFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedFiles.push({ url: e.target?.result as string, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  }

  useFile(file: { url: string; type: string }) {
    if (file.type.startsWith('image/')) {
      this.addImage(file.url);
    } else if (file.type.startsWith('video/')) {
      this.addVideo(file.url);
    }
  }

  get templates(): CanvasTemplate[] {
    return this.templateService.getTemplates();
  }

  applyTemplateToPage(template: CanvasTemplate, pageIndex: number) {
    // Deep copy and assign new IDs
    const newElements = template.elements.map(el => ({ ...el, id: Date.now().toString() + Math.random() }));
    this.canvasService.updatePageElements(pageIndex, newElements);
    setTimeout(() => this.initAllCanvases());
  }

  applyTemplateToAllPages(template: CanvasTemplate) {
    for (let i = 0; i < this.pages.length; i++) {
      // Remove previous template elements (identified by isTemplate: true)
      const userElements = this.pages[i].elements.filter(e => !(e as any).isTemplate);
      // Add new template elements, marked as isTemplate
      const templateElements = template.elements.map(el => ({ ...el, id: Date.now().toString() + Math.random(), isTemplate: true }));
      this.canvasService.updatePageElements(i, [...templateElements, ...userElements]);
    }
    setTimeout(() => this.initAllCanvases());
  }
}