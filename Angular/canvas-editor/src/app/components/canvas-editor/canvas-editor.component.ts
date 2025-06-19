import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CanvasService, CanvasElement, CanvasPage } from '../../services/canvas.service';
import Konva from 'konva';
import { TemplateService, CanvasTemplate } from '../../services/template.service';
import { FileUploadService, UploadedFile } from '../../services/file-upload.service';

@Component({
  selector: 'app-canvas-editor',
  templateUrl: './canvas-editor.component.html',
  styleUrls: ['./canvas-editor.component.scss']
})
export class CanvasEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly BASE_WIDTH = 1920;  // Base width for 16:9
  private readonly BASE_HEIGHT = 1080; // Base height for 16:9
  private readonly MIN_WIDTH = 775;
  private readonly MIN_HEIGHT = 440;
  private readonly ASPECT_RATIO = 16/9;

  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChildren('container') canvasContainers!: QueryList<ElementRef>;
  @ViewChildren('canvasPageWrapper') canvasPageWrappers!: QueryList<ElementRef>;

  public selectedId: string | null = null;
  public selectedPageIndex: number = 0;
  public selectedPageForLayers: number | null = null;
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
  public textToolbarElement: CanvasElement = {
    id: 'default-text-toolbar',
    type: 'text',
    x: 0,
    y: 0,
    width: 200,
    height: 50,
    rotation: 0,
    zIndex: 0,
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000000',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    align: 'left',
    letterSpacing: 0,
    lineHeight: 1.5,
    locked: false
  };
  public fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Tahoma'];
  public alignments = ['left', 'center', 'right', 'justify'];

  shapeFillColor: string = '#cccccc';
  shapeStrokeColor: string = '#000000';

  shapeToolbarVisible: boolean = false;
  shapeToolbarElement: CanvasElement | null = null;

  uploadedFiles: UploadedFile[] = [];

  lockAspectRatio: boolean = true;

  private clipboardElement: CanvasElement | null = null;

  showSaveTemplateModal = false;
  newTemplateName = '';
  newTemplatePreviewUrl = '';
  userTemplates: CanvasTemplate[] = [];
  allTemplates: CanvasTemplate[] = [];

  currentAppliedTemplate: CanvasTemplate | null = null;
  pendingTemplateForNewPage: boolean = false;
  lastPageCount: number = 0;

  // Loading states
  isTemplateLoading: boolean = false;
  isNewPageLoading: boolean = false;
  isFileUploading: boolean = false;
  isSavingTemplate: boolean = false;

  public isSidebarOpen: boolean = true; // Track sidebar state

  private resizeTimeout: any;

  constructor(
    private canvasService: CanvasService,
    private router: Router,
    private templateService: TemplateService,
    private fileUploadService: FileUploadService
  ) {
    // Load fileName from URL if present
    const urlFileName = this.getFileNameFromUrl();
    if (urlFileName) this.fileName = urlFileName;
  }

  ngOnInit() {
    this.checkScreenSize();
    // Clear all uploaded media and templates on page refresh
    this.clearAllOnRefresh();
    
    this.canvasService.pages$.subscribe(pages => {
      // Only reload canvases if the actual page data has changed
      const pagesChanged = JSON.stringify(this.pages) !== JSON.stringify(pages);
      // --- Template for new page logic ---
      if (this.pendingTemplateForNewPage && pages.length > this.lastPageCount && this.currentAppliedTemplate) {
        const newPageIndex = pages.length - 1;
        
        // Process template elements to handle blob URLs
        const processTemplateElements = async () => {
          const templateElements = [];
          
          for (const el of this.currentAppliedTemplate!.elements) {
            const newElement = {
              ...el,
              id: Date.now().toString() + Math.random(),
              isTemplate: true
            };
            
            // Handle image elements with blob URLs
            if (el.type === 'image' && el.imageUrl && el.imageUrl.startsWith('blob:')) {
              try {
                // Try to convert the blob URL to a managed file
                const managedFile = await this.fileUploadService.convertBlobUrlToManagedFile(
                  el.imageUrl, 
                  `template-image-${Date.now()}`
                );
                
                if (managedFile) {
                  newElement.imageUrl = managedFile.url;
                } else {
                  // If conversion fails, try to fetch and recreate the blob URL
                  const response = await fetch(el.imageUrl);
                  const blob = await response.blob();
                  newElement.imageUrl = URL.createObjectURL(blob);
                }
              } catch (error) {
                console.error('Error handling blob URL in new page template:', error);
                // Keep the original URL if all else fails
              }
            }
            
            if (this.isBackgroundElement(newElement)) {
              newElement.locked = true;
            }
            templateElements.push(newElement);
          }
          
          return templateElements;
        };
        
        // Apply the processed template elements
        processTemplateElements().then(templateElements => {
          this.canvasService.updatePageElements(newPageIndex, templateElements);
          this.selectedPageIndex = newPageIndex;
          this.scrollToPage(newPageIndex);
          this.pendingTemplateForNewPage = false;
          this.isNewPageLoading = false;
          setTimeout(() => {
            this.scrollToPage(newPageIndex);
          }, 100);
        }).catch(error => {
          console.error('Error applying template to new page:', error);
          this.pendingTemplateForNewPage = false;
          this.isNewPageLoading = false;
        });
      }
      this.lastPageCount = pages.length;
      this.pages = pages;
      if (pagesChanged) {
      setTimeout(() => this.initAllCanvases());
      this.pushHistory();
      }
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
          if (node && transformer) {
            transformer.nodes([node as any]);
            layer?.add(transformer);
            layer?.draw();
          }
        } else if (!selectedId && this.selectedPageIndex < this.transformers.length) {
          const transformer = this.transformers[this.selectedPageIndex];
          if (transformer) {
            transformer.nodes([]);
            this.layers[this.selectedPageIndex]?.draw();
          }
        }
      });
      // Show/hide text toolbar
      if (selectedId) {
        const el = this.pages[this.selectedPageIndex]?.elements.find(e => e.id === selectedId && e.type === 'text');
        this.updateTextToolbarElement(el ?? null);
        
        // Show/hide shape toolbar
        const shapeEl = this.pages[this.selectedPageIndex]?.elements.find(e => e.id === selectedId && ['rect', 'circle', 'ellipse', 'star', 'line', 'arrow', 'semicircle'].includes(e.type));
        this.shapeToolbarElement = shapeEl ? { ...shapeEl } : null;
        this.shapeToolbarVisible = !!shapeEl;
      } else {
        this.updateTextToolbarElement(null);
        this.shapeToolbarVisible = false;
      }
    });
    this.loadTemplates();
    
    // Load uploaded files from service
    this.uploadedFiles = this.fileUploadService.getUploadedFiles();
    
    // Subscribe to uploaded files changes
    // Note: We'll reload files when they change to ensure we have the latest state
    // This is especially important after page refresh when object URLs are recreated
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Debounce resize events
    this.checkScreenSize();
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.updateCanvasSize();
    }, 250);
  }
 
  private updateCanvasSize() {
    const container = this.canvasContainers?.first?.nativeElement;
    if (!container) return;

    // Get container width and ensure minimum size
    const containerWidth = Math.max(container.offsetWidth, this.MIN_WIDTH);
    const containerHeight = Math.max(containerWidth / this.ASPECT_RATIO, this.MIN_HEIGHT);

    // Update all stages
    this.stages.forEach(stage => {
      stage.width(containerWidth);
      stage.height(containerHeight);
      stage.scale({ 
        x: containerWidth / 1920,
        y: containerHeight / 1080 
      });
      stage.batchDraw();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.initAllCanvases());
    // Add keyboard event listener to canvas container
    const canvasContainer = document.querySelector('.canvas-scroll-container') as HTMLElement;
    if (canvasContainer) {
      canvasContainer.setAttribute('tabindex', '0');
      canvasContainer.addEventListener('keydown', this.handleCanvasKeydown.bind(this));
    }
    
    // Initialize canvas size
    setTimeout(() => {
      this.updateCanvasSize();
    });
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
      
      // Get container dimensions
      const containerWidth = container.offsetWidth;
      const containerHeight = containerWidth * (9/16);
      
      const stage = new Konva.Stage({
        container: container,
        width: containerWidth,
        height: containerHeight,
      });
      
      // Add stage click handler to deselect elements
      stage.on('click', (e) => {
        if (e.target === stage) {
          // Only update if there's actually a selection to clear
          if (this.selectedId !== null) {
            this.selectedId = null;
            this.canvasService.setSelectedElementId(null);
            this.shapeToolbarVisible = false;
            this.transformers[i].nodes([]);
            this.layers[i].draw();
          }
        }
      });
      
      const layer = new Konva.Layer();
      stage.add(layer);
      const transformer = new Konva.Transformer({
        nodes: [],
        rotateEnabled: true, // Enable rotation handle
        resizeEnabled: true, // Enable resize handles
        enabledAnchors: [
          'top-left', 'top-center', 'top-right',
          'middle-left', 'middle-right',
          'bottom-left', 'bottom-center', 'bottom-right'
        ], // Enable all resize handles
        borderStroke: '#1976d2',
        borderStrokeWidth: 2,
        anchorStroke: '#1976d2',
        anchorFill: '#ffffff',
        anchorSize: 8,
        anchorCornerRadius: 4,
        anchorStrokeWidth: 2,
        anchorShadowEnabled: true,
        anchorShadowColor: '#000000',
        anchorShadowBlur: 2,
        anchorShadowOffset: { x: 1, y: 1 },
        anchorShadowOpacity: 0.3,
        // Add boundBoxFunc to handle line shapes better
        boundBoxFunc: (oldBox, newBox) => {
          // For line shapes, allow any transformation
          return newBox;
        }
      });
      
      // Add transform event handler to the transformer
      transformer.on('transform', () => {
        const nodes = transformer.nodes();
        if (nodes.length > 0) {
          const node = nodes[0];
          // Force update the transformer
          transformer.forceUpdate();
        }
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
    
    // Store current selection
    const currentSelectedId = this.selectedId;
    
    // Remove transformer temporarily
    transformer.remove();
    
    // Clear all nodes except transformer
    layer.destroyChildren();
    
    // Add elements
    elements.forEach(element => {
      const node = this.createElementNode(element, pageIndex);
      if (node !== null) {
        layer.add(node as any);
      }
    });
    
    // Always add transformer last so it appears above all nodes
    layer.add(transformer);
    
    // Restore selection if it was the same element
    if (currentSelectedId) {
      const selectedNode = layer.findOne(`#${currentSelectedId}`);
      const element = this.pages[pageIndex]?.elements.find(e => e.id === currentSelectedId);
      
      // Don't restore selection if element is locked
      if (selectedNode && element && element.locked !== true) {
        this.selectedId = currentSelectedId;
        this.canvasService.setSelectedElementId(currentSelectedId);
        transformer.nodes([selectedNode as any]);
        layer.add(transformer); // bring transformer to top
        
        // Update toolbar visibility
        if (element) {
          if (element.type === 'text') {
            this.updateTextToolbarElement(element);
            this.shapeToolbarVisible = false;
          } else if (['rect', 'circle', 'ellipse', 'star', 'line', 'arrow', 'semicircle'].includes(element.type)) {
            this.shapeToolbarElement = { ...element };
            this.shapeToolbarVisible = true;
          }
        }
      } else {
        // Clear selection if element no longer exists or is locked
        this.selectedId = null;
        this.canvasService.setSelectedElementId(null);
        this.shapeToolbarVisible = false;
      }
    }
    
    layer.draw();
  }

  private createElementNode(element: CanvasElement, pageIndex: number): Konva.Node | null {
    let node: Konva.Node | null = null;
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
        draggable: element.locked !== true,
        visible: element.visible !== false,
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
        // Don't select if element is locked
        if (element.locked === true) return;
        
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
          const newValue = textarea.value;
          if (newValue.trim() !== '') {
            (node as Konva.Text).text(newValue);
            this.updateElementDataOnly(element.id, { text: newValue }, pageIndex);
          }
          else {
            this.canvasService.deleteElement(element.id);
          }
          removeTextarea();
          this.editingTextId = null;
          setTimeout(() => this.initAllCanvases());
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
        draggable: element.locked !== true,
        visible: element.visible !== false
      });
      node.on('click', () => {
        // Don't select if element is locked
        if (element.locked === true) return;
        
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
        draggable: element.locked !== true,
        visible: element.visible !== false
      });
      node.on('click', () => {
        // Don't select if element is locked
        if (element.locked === true) return;
        
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
        draggable: element.locked !== true,
        visible: element.visible !== false
      });
      node.on('click', () => {
        // Don't select if element is locked
        if (element.locked === true) return;
        
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        if (this.transformers[pageIndex] && node) {
          this.transformers[pageIndex].nodes([node]);
          this.layers[pageIndex].add(this.transformers[pageIndex]); // bring transformer to top
          this.layers[pageIndex].draw();
        }
        this.selectedPageIndex = pageIndex;
      });
    } else if (element.type === 'line' || element.type === 'arrow') {
      // --- Custom endpoint handles for lines/arrows ---
      const isArrow = element.type === 'arrow';
      const points = element.points || [0, 0, 100, 0];
      let displayPoints = points;
      if (isArrow) {
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
        displayPoints = [...points, arrow1X, arrow1Y, endX, endY, arrow2X, arrow2Y];
      }
      const bbox = this.getPointsBoundingBox(displayPoints);
      const group = new Konva.Group({
        id: element.id,
        x: element.x || 0,
        y: element.y || 0,
        draggable: element.locked !== true,
        visible: element.visible !== false
      });
      const background = new Konva.Rect({
        x: bbox.minX,
        y: bbox.minY,
        width: bbox.maxX - bbox.minX || 10,
        height: bbox.maxY - bbox.minY || 10,
        fill: 'transparent',
        stroke: 'transparent'
      });
      const line = new Konva.Line({
        points: displayPoints,
        stroke: element.stroke || '#000000',
        strokeWidth: element.strokeWidth || 2,
        opacity: element.opacity || 1,
        rotation: element.rotation || 0,
        lineCap: 'round',
        lineJoin: 'round'
      });
      group.add(background);
      group.add(line);
      // --- Endpoint handles ---
      const origPoints = element.points || [0, 0, 100, 0];
      const handle1 = new Konva.Circle({
        x: origPoints[0],
        y: origPoints[1],
        radius: 7,
        fill: '#1976d2',
        stroke: '#fff',
        strokeWidth: 2,
        draggable: true,
        visible: this.selectedId === element.id
      });
      const handle2 = new Konva.Circle({
        x: origPoints[2],
        y: origPoints[3],
        radius: 7,
        fill: '#1976d2',
        stroke: '#fff',
        strokeWidth: 2,
        draggable: true,
        visible: this.selectedId === element.id
      });
      // Drag logic for handle1
      handle1.on('dragmove', () => {
        const newX = handle1.x();
        const newY = handle1.y();
        const newPoints = [newX, newY, origPoints[2], origPoints[3]];
        this.updateElementDataOnly(element.id, {
          points: newPoints
        }, pageIndex);
        // Redraw line and handle2
        const newDisplayPoints = isArrow ? this.getArrowDisplayPoints(newPoints) : newPoints;
        line.points(newDisplayPoints);
        handle2.x(newPoints[2]);
        handle2.y(newPoints[3]);
        handle1.x(newPoints[0]);
        handle1.y(newPoints[1]);
        const newBbox = this.getPointsBoundingBox(newDisplayPoints);
        background.x(newBbox.minX);
        background.y(newBbox.minY);
        background.width(newBbox.maxX - newBbox.minX || 10);
        background.height(newBbox.maxY - newBbox.minY || 10);
      });
      // Drag logic for handle2
      handle2.on('dragmove', () => {
        const newX = handle2.x();
        const newY = handle2.y();
        const newPoints = [origPoints[0], origPoints[1], newX, newY];
        this.updateElementDataOnly(element.id, {
          points: newPoints
        }, pageIndex);
        // Redraw line and handle1
        const newDisplayPoints = isArrow ? this.getArrowDisplayPoints(newPoints) : newPoints;
        line.points(newDisplayPoints);
        handle1.x(newPoints[0]);
        handle1.y(newPoints[1]);
        handle2.x(newPoints[2]);
        handle2.y(newPoints[3]);
        const newBbox = this.getPointsBoundingBox(newDisplayPoints);
        background.x(newBbox.minX);
        background.y(newBbox.minY);
        background.width(newBbox.maxX - newBbox.minX || 10);
        background.height(newBbox.maxY - newBbox.minY || 10);
      });
      // Show/hide handles on selection
      group.on('click', () => {
        // Don't select if element is locked
        if (element.locked === true) return;
        
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        handle1.visible(true);
        handle2.visible(true);
        this.shapeToolbarElement = { ...element };
        this.shapeToolbarVisible = true;
        this.selectedPageIndex = pageIndex;
        group.getLayer()?.draw();
      });
      group.on('mousedown touchstart', (e) => {
        // Don't select if element is locked
        if (element.locked === true) return;
        
        e.cancelBubble = true;
        this.selectedId = element.id;
        this.canvasService.setSelectedElementId(element.id);
        handle1.visible(true);
        handle2.visible(true);
        this.shapeToolbarElement = { ...element };
        this.shapeToolbarVisible = true;
        this.selectedPageIndex = pageIndex;
        group.getLayer()?.draw();
      });
      node = group;
      group.add(handle1);
      group.add(handle2);
    } else if (element.type === 'semicircle') {
      // Create semicircle using Konva.Arc
      const radius = (element.width || 100) / 2;
      const centerX = element.x + radius;
      const centerY = element.y + radius;
      
      node = new Konva.Arc({
        id: element.id,
        x: centerX,
        y: centerY,
        innerRadius: 0,
        outerRadius: radius,
        angle: 180,
        rotation: element.rotation,
        fill: element.fill,
        stroke: element.stroke,
        strokeWidth: element.strokeWidth,
        opacity: element.opacity,
        draggable: element.locked !== true,
        visible: element.visible !== false
      });
      node.on('click', () => {
        // Don't select if element is locked
        if (element.locked === true) return;
        
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
        draggable: element.locked !== true,
        visible: element.visible !== false
      });
      node.on('click', () => {
        // Don't select if element is locked
        if (element.locked === true) return;
        
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
        draggable: element.locked !== true,
        visible: element.visible !== false
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
        // Update the element data without triggering visual updates
        this.updateElementDataOnly(element.id, {
          x: n.x(),
          y: n.y(),
          width,
          height,
          rotation: n.rotation()
        }, pageIndex);
      } else if (element.type === 'circle') {
        // For circles, convert center coordinates to top-left corner
        const circleNode = n as Konva.Circle;
        const radius = circleNode.radius() * n.scaleX();
        const width = radius * 2;
        const height = radius * 2;
        const x = n.x() - radius;
        const y = n.y() - radius;
        n.scaleX(1);
        n.scaleY(1);
        this.updateElementDataOnly(element.id, {
          x,
          y,
          width,
          height,
          rotation: n.rotation()
        }, pageIndex);
      } else if (element.type === 'ellipse') {
        // For ellipses, convert center coordinates to top-left corner
        const ellipseNode = n as Konva.Ellipse;
        const radiusX = ellipseNode.radiusX() * n.scaleX();
        const radiusY = ellipseNode.radiusY() * n.scaleY();
        const width = radiusX * 2;
        const height = radiusY * 2;
        const x = n.x() - radiusX;
        const y = n.y() - radiusY;
        n.scaleX(1);
        n.scaleY(1);
        this.updateElementDataOnly(element.id, {
          x,
          y,
          width,
          height,
          rotation: n.rotation()
        }, pageIndex);
      } else if (element.type === 'star') {
        // For stars, convert center coordinates to top-left corner
        const starNode = n as Konva.Star;
        const outerRadius = starNode.outerRadius() * n.scaleX();
        const width = outerRadius * 2;
        const height = outerRadius * 2;
        const x = n.x() - outerRadius;
        const y = n.y() - outerRadius;
        n.scaleX(1);
        n.scaleY(1);
        this.updateElementDataOnly(element.id, {
          x,
          y,
          width,
          height,
          rotation: n.rotation()
        }, pageIndex);
      } else if (element.type === 'line' || element.type === 'arrow') {
        // For line-based shapes, handle scaling and position changes
        const originalPoints = element.points || [];
        const scaleX = n.scaleX();
        const scaleY = n.scaleY();
        
        // Scale the points based on the transformation
        const newPoints = originalPoints.map((point, index) => {
          if (index % 2 === 0) {
            return point * scaleX; // x coordinate
      } else {
            return point * scaleY; // y coordinate
          }
        });
        
        // Reset scale and update position
        n.scaleX(1);
        n.scaleY(1);
        
        this.updateElementDataOnly(element.id, {
          x: n.x(),
          y: n.y(),
          points: newPoints,
          rotation: n.rotation()
        }, pageIndex);
        
        // Update the visual representation directly without triggering reloads
        const layer = this.layers[pageIndex];
        if (layer) {
          const groupNode = layer.findOne(`#${element.id}`) as Konva.Group;
          if (groupNode) {
            // Update the line within the group
            const line = groupNode.findOne('Line') as Konva.Line;
            if (line) {
              line.points(newPoints);
            }
            layer.draw();
          }
        }
      } else if (element.type === 'semicircle') {
        // For semicircles, convert center coordinates to top-left corner
        const arcNode = n as Konva.Arc;
        const radius = arcNode.outerRadius() * n.scaleX();
        const width = radius * 2;
        const height = radius * 2;
        const x = n.x() - radius;
        const y = n.y() - radius;
        n.scaleX(1);
        n.scaleY(1);
        this.updateElementDataOnly(element.id, {
          x,
          y,
          width,
          height,
          rotation: n.rotation()
        }, pageIndex);
      } else {
        // For rectangles and other shapes, use standard coordinates
        const updatedElement = {
          x: n.x(),
          y: n.y(),
          width: n.width() * n.scaleX(),
          height: n.height() * n.scaleY(),
          rotation: n.rotation()
        };
        this.updateElementDataOnly(element.id, updatedElement, pageIndex);
        n.scaleX(1);
        n.scaleY(1);
      }
      
      // Ensure transformer stays attached and selection is preserved
      this.ensureTransformerAttached(element.id, pageIndex);
    });
    node.on('dragend', () => {
      const n = node!;
      if (element.type === 'circle') {
        // For circles, convert center coordinates to top-left corner
        const circleNode = n as Konva.Circle;
        const radius = circleNode.radius();
        const x = n.x() - radius;
        const y = n.y() - radius;
        this.updateElementDataOnly(element.id, { x, y }, pageIndex);
      } else if (element.type === 'ellipse') {
        // For ellipses, convert center coordinates to top-left corner
        const ellipseNode = n as Konva.Ellipse;
        const radiusX = ellipseNode.radiusX();
        const radiusY = ellipseNode.radiusY();
        const x = n.x() - radiusX;
        const y = n.y() - radiusY;
        this.updateElementDataOnly(element.id, { x, y }, pageIndex);
      } else if (element.type === 'star') {
        // For stars, convert center coordinates to top-left corner
        const starNode = n as Konva.Star;
        const outerRadius = starNode.outerRadius();
        const x = n.x() - outerRadius;
        const y = n.y() - outerRadius;
        this.updateElementDataOnly(element.id, { x, y }, pageIndex);
      } else if (element.type === 'line' || element.type === 'arrow') {
        // For line-based shapes, update the points array based on the new position
        const originalPoints = element.points || [];
        const deltaX = n.x() - element.x;
        const deltaY = n.y() - element.y;
        
        // Update all points by the delta
        const newPoints = originalPoints.map((point, index) => {
          if (index % 2 === 0) {
            return point + deltaX; // x coordinate
          } else {
            return point + deltaY; // y coordinate
          }
        });
        
        this.updateElementDataOnly(element.id, {
          x: n.x(),
          y: n.y(),
          points: newPoints
        }, pageIndex);
      } else if (element.type === 'semicircle') {
        // For semicircles, convert center coordinates to top-left corner
        const arcNode = n as Konva.Arc;
        const radius = arcNode.outerRadius();
        const x = n.x() - radius;
        const y = n.y() - radius;
        this.updateElementDataOnly(element.id, { x, y }, pageIndex);
      } else {
        // For rectangles and other shapes, use standard coordinates
        this.updateElementDataOnly(element.id, {
        x: n.x(),
        y: n.y()
      }, pageIndex);
      }
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
    this.newText = '';
    setTimeout(() => this.initAllCanvases());
  }

  addImage(url: string): void {
    const img = new Image();
    img.onload = () => {
      const element: CanvasElement = {
        id: Date.now().toString(),
        type: 'image',
        x: 100,
        y: 100,
        width: 200,
        height: 200,
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
      this.showAddImageModal = false; // Close the modal
      this.newImageUrl = ''; // Clear the input
    };
    img.onerror = () => {
      this.showSoftAlert('Enter a proper URL. Image not found.');
      this.showAddImageModal = false; // Close the modal
      this.newImageUrl = ''; // Clear the input
    };
    img.src = url;
  }

  showSoftAlert(message: string): void {
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.backgroundColor = '#f44336';
    alertDiv.style.color = '#fff';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.fontSize = '14px';
    alertDiv.style.transition = 'opacity 0.4s ease';

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
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
        draggable: element.locked !== true,
        visible: element.visible !== false
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
        draggable: element.locked !== true,
        visible: element.visible !== false
      });
    }

    if (konvaNode) {
      layer.add(konvaNode);
      layer.draw();
    }
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
    // Always update the element regardless of which page is selected
      this.canvasService.switchPage(pageIndex);
      this.canvasService.updateElement(id, updates);
    
    // Update the visual representation of the specific element
    this.updateElementVisual(id, updates, pageIndex);
  }

  private updateElementVisual(id: string, updates: Partial<CanvasElement>, pageIndex: number) {
    const layer = this.layers[pageIndex];
    if (!layer) return;
    
    const node = layer.findOne(`#${id}`);
    if (!node) return;
    
    // Update the node properties based on the updates
    if (updates.x !== undefined) node.x(updates.x);
    if (updates.y !== undefined) node.y(updates.y);
    if (updates.rotation !== undefined) node.rotation(updates.rotation);
    if (updates.opacity !== undefined) node.opacity(updates.opacity);
    
    // Handle shape-specific updates
    if (node instanceof Konva.Rect) {
      if (updates.width !== undefined) node.width(updates.width);
      if (updates.height !== undefined) node.height(updates.height);
      if (updates.fill !== undefined) node.fill(updates.fill);
      if (updates.stroke !== undefined) node.stroke(updates.stroke);
      if (updates.strokeWidth !== undefined) node.strokeWidth(updates.strokeWidth);
      if (updates.borderRadius !== undefined) node.cornerRadius(updates.borderRadius);
    } else if (node instanceof Konva.Circle) {
      if (updates.width !== undefined) {
        const radius = updates.width / 2;
        node.radius(radius);
        // Update position to maintain center-based positioning
        if (updates.x !== undefined) node.x(updates.x + radius);
        if (updates.y !== undefined) node.y(updates.y + radius);
      }
      if (updates.fill !== undefined) node.fill(updates.fill);
      if (updates.stroke !== undefined) node.stroke(updates.stroke);
      if (updates.strokeWidth !== undefined) node.strokeWidth(updates.strokeWidth);
    } else if (node instanceof Konva.Ellipse) {
      if (updates.width !== undefined) {
        const radiusX = updates.width / 2;
        node.radiusX(radiusX);
        if (updates.x !== undefined) node.x(updates.x + radiusX);
      }
      if (updates.height !== undefined) {
        const radiusY = updates.height / 2;
        node.radiusY(radiusY);
        if (updates.y !== undefined) node.y(updates.y + radiusY);
      }
      if (updates.fill !== undefined) node.fill(updates.fill);
      if (updates.stroke !== undefined) node.stroke(updates.stroke);
      if (updates.strokeWidth !== undefined) node.strokeWidth(updates.strokeWidth);
    } else if (node instanceof Konva.Star) {
      if (updates.width !== undefined) {
        const outerRadius = updates.width / 2;
        node.outerRadius(outerRadius);
        node.innerRadius(outerRadius / 2);
        if (updates.x !== undefined) node.x(updates.x + outerRadius);
        if (updates.y !== undefined) node.y(updates.y + outerRadius);
      }
      if (updates.fill !== undefined) node.fill(updates.fill);
      if (updates.stroke !== undefined) node.stroke(updates.stroke);
      if (updates.strokeWidth !== undefined) node.strokeWidth(updates.strokeWidth);
      if (updates.numPoints !== undefined) node.numPoints(updates.numPoints);
    } else if (node instanceof Konva.Line) {
      // Handle line and arrow updates
      if (updates.stroke !== undefined) node.stroke(updates.stroke);
      if (updates.strokeWidth !== undefined) node.strokeWidth(updates.strokeWidth);
      if (updates.fill !== undefined) node.fill(updates.fill);
      if (updates.points !== undefined) node.points(updates.points);
      if (updates.x !== undefined) node.x(updates.x);
      if (updates.y !== undefined) node.y(updates.y);
    } else if (node instanceof Konva.Arc) {
      // Handle semicircle updates
      if (updates.width !== undefined) {
        const radius = updates.width / 2;
        node.outerRadius(radius);
        if (updates.x !== undefined) node.x(updates.x + radius);
        if (updates.y !== undefined) node.y(updates.y + radius);
      }
      if (updates.fill !== undefined) node.fill(updates.fill);
      if (updates.stroke !== undefined) node.stroke(updates.stroke);
      if (updates.strokeWidth !== undefined) node.strokeWidth(updates.strokeWidth);
    } else if (node instanceof Konva.Text) {
      if (updates.text !== undefined) node.text(updates.text);
      if (updates.fontSize !== undefined) node.fontSize(updates.fontSize);
      if (updates.color !== undefined) node.fill(updates.color);
      if (updates.fontFamily !== undefined) node.fontFamily(updates.fontFamily);
      if (updates.fontStyle !== undefined) node.fontStyle(updates.fontStyle);
      if (updates.fontWeight !== undefined) (node as any).fontWeight(updates.fontWeight);
      if (updates.align !== undefined) node.align(updates.align);
    } else if (node instanceof Konva.Group) {
      // Handle group updates (for line and arrow shapes)
      if (updates.x !== undefined) node.x(updates.x);
      if (updates.y !== undefined) node.y(updates.y);
      if (updates.rotation !== undefined) node.rotation(updates.rotation);
      
      // Update the line within the group if points are provided
      if (updates.points !== undefined) {
        const line = node.findOne('Line') as Konva.Line;
        if (line) {
          line.points(updates.points);
        }
      }
      
      // Update stroke properties if provided
      if (updates.stroke !== undefined || updates.strokeWidth !== undefined) {
        const line = node.findOne('Line') as Konva.Line;
        if (line) {
          if (updates.stroke !== undefined) line.stroke(updates.stroke);
          if (updates.strokeWidth !== undefined) line.strokeWidth(updates.strokeWidth);
        }
      }
    }
    
    // Redraw the layer
    layer.draw();
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
    if (this.currentAppliedTemplate) {
      this.pendingTemplateForNewPage = true;
      this.isNewPageLoading = true;
      this.canvasService.addPage();
    } else {
    this.canvasService.addPage();
    setTimeout(() => {
      this.selectedPageIndex = this.pages.length - 1;
      this.scrollToPage(this.selectedPageIndex);
    });
    }
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
    // Toggle layer visibility - if same page is clicked, hide layers; if different page, show layers for that page
    if (this.selectedPageForLayers === index) {
      this.selectedPageForLayers = null; // Hide layers
    } else {
      this.selectedPageForLayers = index; // Show layers for this page
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

  public addShape(type: 'rect' | 'circle' | 'ellipse' | 'star' | 'line' | 'arrow' | 'semicircle') {
    let points: number[] = [0, 0, 100, 0]; // Default for line/arrow
    
    // Set appropriate default points for each shape type
    if (type === 'line') {
      points = [0, 0, 100, 0];
    } else if (type === 'arrow') {
      points = [0, 0, 100, 0];
    }
    
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
      points: points,
    };
    this.canvasService.switchPage(this.selectedPageIndex);
    this.canvasService.addElement(element);
    setTimeout(() => this.initAllCanvases());
  }

  ngOnDestroy() {
    // Cleanup object URLs to prevent memory leaks
    this.uploadedFiles.forEach(file => {
      if (file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    });
  }

  onShapeSelect(element: CanvasElement) {
    this.shapeToolbarVisible = true;
    this.shapeToolbarElement = element;
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
      // Update local toolbar state for instant UI feedback
      Object.assign(this.shapeToolbarElement, updates);
      // No need to reload the entire canvas - just update the specific element
    }
  }

  onFileUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach(file => {
        const fileReader = new FileReader();
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
          const fileUrl = e.target?.result as string;
          const uploadedFile: UploadedFile = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            url: fileUrl,
            uploadedAt: new Date() // Add the missing property
          };
          this.uploadedFiles.push(uploadedFile);
          this.fileUploadService.addFile(uploadedFile); // Persist the file
        };
        fileReader.readAsDataURL(file); // Read the file as a data URL
      });
    }
  }

  useFile(file: UploadedFile) {
    if (file.type.startsWith('image/')) {
      this.addImage(file.url);
    } else if (file.type.startsWith('video/')) {
      this.addVideo(file.url);
    }
  }

  deleteUploadedFile(fileId: string) {
    this.fileUploadService.deleteFile(fileId);
    this.refreshUploadedFiles();
  }

  clearAllUploadedFiles() {
    this.fileUploadService.clearAllFiles();
    this.refreshUploadedFiles();
  }

  private refreshUploadedFiles() {
    this.uploadedFiles = this.fileUploadService.getUploadedFiles();
  }

  private clearAllOnRefresh() {
    // Clear all uploaded files
    this.fileUploadService.clearAllFiles();
    this.uploadedFiles = [];
    
    // Clear all user templates
    localStorage.removeItem('userTemplates');
    this.userTemplates = [];
    this.allTemplates = this.templateService.getTemplates(); // Keep only built-in templates
    
    // Clear current applied template
    this.currentAppliedTemplate = null;
    this.pendingTemplateForNewPage = false;
    
    // Clear canvas state and start with a fresh page
    this.canvasService.loadStateFromJson(JSON.stringify({
      pages: [{ id: Date.now().toString() + Math.random(), title: 'Page 1', elements: [] }],
      currentPageIndex: 0
    }));
    
    // Reset component state
    this.selectedPageIndex = 0;
    this.selectedId = null;
    this.shapeToolbarVisible = false;
    this.shapeToolbarElement = null;
    
    console.log('All uploaded media, templates, and canvas state cleared on page refresh');
  }

  // Public method to manually clear everything
  clearAllData() {
    this.clearAllOnRefresh();
    // Refresh the UI
    setTimeout(() => {
      this.initAllCanvases();
      this.loadTemplates();
    });
  }

  get templates(): CanvasTemplate[] {
    return this.allTemplates;
  }

  applyTemplateToPage(template: CanvasTemplate, pageIndex: number) {
    // Show loading spinner for large templates
    const isLargeTemplate = template.elements.length > 10;
    if (isLargeTemplate) {
      this.isTemplateLoading = true;
    }
    
    // Process template elements to handle blob URLs
    const processElements = async () => {
      const newElements = [];
      
      for (const el of template.elements) {
        const newElement = { 
          ...el, 
          id: Date.now().toString() + Math.random(),
          isTemplate: true
        };
        
        // Handle image elements with blob URLs
        if (el.type === 'image' && el.imageUrl && el.imageUrl.startsWith('blob:')) {
          try {
            // Try to convert the blob URL to a managed file
            const managedFile = await this.fileUploadService.convertBlobUrlToManagedFile(
              el.imageUrl, 
              `template-image-${Date.now()}`
            );
            
            if (managedFile) {
              newElement.imageUrl = managedFile.url;
            } else {
              // If conversion fails, try to fetch and recreate the blob URL
              const response = await fetch(el.imageUrl);
              const blob = await response.blob();
              newElement.imageUrl = URL.createObjectURL(blob);
            }
          } catch (error) {
            console.error('Error handling blob URL in template:', error);
            // Keep the original URL if all else fails
          }
        }
        
        // Automatically lock background elements
        if (this.isBackgroundElement(newElement)) {
          newElement.locked = true;
        }
        
        newElements.push(newElement);
      }
      
      return newElements;
    };
    
    // Apply the processed elements
    processElements().then(newElements => {
    this.canvasService.updatePageElements(pageIndex, newElements);
      setTimeout(() => {
        this.initAllCanvases();
        if (isLargeTemplate) {
          this.isTemplateLoading = false;
        }
      });
    }).catch(error => {
      console.error('Error applying template:', error);
      if (isLargeTemplate) {
        this.isTemplateLoading = false;
      }
    });
  }

  applyTemplateToAllPages(template: CanvasTemplate) {
    // Show loading spinner for large templates
    const isLargeTemplate = template.elements.length > 10;
    if (isLargeTemplate) {
      this.isTemplateLoading = true;
    }
    
    this.currentAppliedTemplate = template;
    
    // Process template elements to handle blob URLs
    const processElements = async () => {
      const processedElements = [];
      
      for (const el of template.elements) {
        const newElement = { 
          ...el, 
          id: Date.now().toString() + Math.random(), 
          isTemplate: true 
        };
        
        // Handle image elements with blob URLs
        if (el.type === 'image' && el.imageUrl && el.imageUrl.startsWith('blob:')) {
          try {
            // Try to convert the blob URL to a managed file
            const managedFile = await this.fileUploadService.convertBlobUrlToManagedFile(
              el.imageUrl, 
              `template-image-${Date.now()}`
            );
            
            if (managedFile) {
              newElement.imageUrl = managedFile.url;
            } else {
              // If conversion fails, try to fetch and recreate the blob URL
              const response = await fetch(el.imageUrl);
              const blob = await response.blob();
              newElement.imageUrl = URL.createObjectURL(blob);
            }
          } catch (error) {
            console.error('Error handling blob URL in template:', error);
            // Keep the original URL if all else fails
          }
        }
        
        // Automatically lock background elements
        if (this.isBackgroundElement(newElement)) {
          newElement.locked = true;
        }
        
        processedElements.push(newElement);
      }
      
      return processedElements;
    };
    
    // Apply the processed elements to all pages
    processElements().then(templateElements => {
    for (let i = 0; i < this.pages.length; i++) {
        // Get existing user elements (non-template elements)
        const userElements = this.pages[i].elements.filter(el => !el.isTemplate);
        // Add new template elements
      this.canvasService.updatePageElements(i, [...templateElements, ...userElements]);
    }
      
      setTimeout(() => {
        this.initAllCanvases();
        if (isLargeTemplate) {
          this.isTemplateLoading = false;
        }
      });
    }).catch(error => {
      console.error('Error applying template to all pages:', error);
      if (isLargeTemplate) {
        this.isTemplateLoading = false;
      }
    });
  }

  private isBackgroundElement(element: CanvasElement): boolean {
    // Check if element is a background element based on ID patterns and properties
    const backgroundIdPatterns = ['bg', 'frame', 'background', 'base'];
    const isBackgroundId = backgroundIdPatterns.some(pattern => 
      element.id.toLowerCase().includes(pattern)
    );
    
    // Check if it's a large rectangle that covers most of the canvas
    const isLargeBackgroundShape = element.type === 'rect' && 
      element.width >= 800 && element.height >= 600 && 
      element.zIndex <= 2;
    
    // Check if it's a decorative background element
    const isDecorativeBackground = element.type === 'rect' && 
      element.zIndex <= 1 && 
      (!!element.fill || !!element.stroke);
    
    return isBackgroundId || isLargeBackgroundShape || isDecorativeBackground;
  }

  handleCanvasKeydown(event: KeyboardEvent) {
    if (document.activeElement && document.activeElement.classList.contains('canvas-scroll-container')) {
      if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedId) {
        event.preventDefault();
        this.deleteSelected();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        this.undo();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        this.redo();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && this.selectedId) {
        event.preventDefault();
        // Copy selected element
        const el = this.pages[this.selectedPageIndex]?.elements.find(e => e.id === this.selectedId);
        if (el) {
          const { id, ...rest } = el;
          this.clipboardElement = { ...rest, id: 'clipboard' };
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'x' && this.selectedId) {
        event.preventDefault();
        // Cut selected element
        const el = this.pages[this.selectedPageIndex]?.elements.find(e => e.id === this.selectedId);
        if (el) {
          const { id, ...rest } = el;
          this.clipboardElement = { ...rest, id: 'clipboard' };
          this.deleteSelected();
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        // Paste element
        if (this.clipboardElement) {
          const pasted = {
            ...this.clipboardElement,
            id: Date.now().toString() + Math.random(),
            x: (this.clipboardElement.x || 0) + 20,
            y: (this.clipboardElement.y || 0) + 20,
          };
          this.canvasService.switchPage(this.selectedPageIndex);
          this.canvasService.addElement(pasted);
          setTimeout(() => this.initAllCanvases());
        }
      }
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);
      this.isFileUploading = true;
      this.fileUploadService.uploadMultipleFiles(files).subscribe(uploadedFiles => {
        this.refreshUploadedFiles();
        this.isFileUploading = false;
      });
    }
  }

  private updateElementDataOnly(id: string, updates: Partial<CanvasElement>, pageIndex: number) {
    // Always update the element regardless of which page is selected
    const element = this.pages[pageIndex]?.elements.find(e => e.id === id);
    if (element && (element.type === 'line' || element.type === 'arrow') && updates.points) {
      const bbox = this.getPointsBoundingBox(updates.points);
      updates.x = bbox.minX;
      updates.y = bbox.minY;
      updates.width = bbox.maxX - bbox.minX;
      updates.height = bbox.maxY - bbox.minY;
    }
    this.canvasService.switchPage(pageIndex);
    this.canvasService.updateElement(id, updates);
  }

  private ensureTransformerAttached(elementId: string, pageIndex: number) {
    const layer = this.layers[pageIndex];
    const transformer = this.transformers[pageIndex];
    if (!layer || !transformer) return;
    
    const node = layer.findOne(`#${elementId}`);
    if (node) {
      // Check if element is locked
      const element = this.pages[pageIndex]?.elements.find(e => e.id === elementId);
      if (element && element.locked === true) {
        // Don't attach transformer to locked elements
        transformer.nodes([]);
        layer.draw();
        return;
      }
      
      // Ensure transformer is attached to the node
      transformer.nodes([node as any]);
      layer.add(transformer); // bring transformer to top
      layer.draw();
      
      // Update selection state
      this.selectedId = elementId;
      this.canvasService.setSelectedElementId(elementId);
      
      // Update toolbar visibility
      if (element) {
        if (element.type === 'text') {
          this.updateTextToolbarElement(element);
        } else if (['rect', 'circle', 'ellipse', 'star', 'line', 'arrow', 'semicircle'].includes(element.type)) {
          this.shapeToolbarElement = { ...element };
          this.shapeToolbarVisible = true;
        }
      }
    }
  }

  // Utility to get bounding box from points
  private getPointsBoundingBox(points: number[]): { minX: number, minY: number, maxX: number, maxY: number } {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
    return { minX, minY, maxX, maxY };
  }

  // Utility to get display points for arrow (with arrowhead)
  private getArrowDisplayPoints(points: number[]): number[] {
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
    return [...points, arrow1X, arrow1Y, endX, endY, arrow2X, arrow2Y];
  }

  getLayerDisplayName(element: CanvasElement): string {
    if (element.type === 'text') {
      return element.text || 'Text';
    } else if (element.type === 'image') {
      return 'Image';
    } else {
      return element.type.charAt(0).toUpperCase() + element.type.slice(1);
    }
  }

  selectLayerElement(elementId: string) {
    if (this.selectedPageForLayers === null) return;
    
    const page = this.pages[this.selectedPageForLayers];
    const element = page.elements.find(el => el.id === elementId);
    
    // Don't select locked elements
    if (element && element.locked === true) {
      return;
    }
    
    this.selectedId = elementId;
    this.canvasService.setSelectedElementId(elementId);
    this.selectedPageIndex = this.selectedPageForLayers!;
  }

  toggleLayerVisibility(elementId: string) {
    if (this.selectedPageForLayers === null) return;
    
    const page = this.pages[this.selectedPageForLayers];
    const element = page.elements.find(el => el.id === elementId);
    if (!element) return;
    
    // Toggle visibility
    const newVisible = !element.visible;
    
    // Update the element's visibility
    this.canvasService.updateElement(elementId, { visible: newVisible });
    
    // Update the visual representation on the canvas
    const layer = this.layers[this.selectedPageForLayers];
    if (layer) {
      const node = layer.findOne(`#${elementId}`);
      if (node) {
        node.visible(newVisible);
        layer.draw();
      }
    }
  }

  toggleLayerLock(elementId: string) {
    if (this.selectedPageForLayers === null) return;
    
    const page = this.pages[this.selectedPageForLayers];
    const element = page.elements.find(el => el.id === elementId);
    if (!element) return;
    
    // Toggle lock
    const newLocked = !element.locked;
    
    // Update the element's lock state
    this.canvasService.updateElement(elementId, { locked: newLocked });
    
    // Update the visual representation on the canvas
    const layer = this.layers[this.selectedPageForLayers];
    if (layer) {
      const node = layer.findOne(`#${elementId}`);
      if (node) {
        node.draggable(!newLocked);
        layer.draw();
      }
    }
  }

  toggleSelectedElementLock() {
    if (!this.selectedId) return;
    
    const element = this.pages[this.selectedPageIndex]?.elements.find(el => el.id === this.selectedId);
    if (!element) return;
    
    // Toggle lock
    const newLocked = !element.locked;
    
    // Update the element's lock state
    this.canvasService.updateElement(this.selectedId, { locked: newLocked });
    
    // Update the visual representation on the canvas
    const layer = this.layers[this.selectedPageIndex];
    if (layer) {
      const node = layer.findOne(`#${this.selectedId}`);
      if (node) {
        node.draggable(!newLocked);
        layer.draw();
      }
    }
    
    // Refresh the canvas to update transformers and other visual elements
    setTimeout(() => this.initAllCanvases());
  }

  isSelectedElementLocked(): boolean {
    if (!this.selectedId) return false;
    
    const element = this.pages[this.selectedPageIndex]?.elements.find(el => el.id === this.selectedId);
    return element?.locked === true;
  }

  deleteLayerElement(elementId: string) {
    this.selectedId = elementId;
    this.deleteSelected();
  }

  moveLayerUp(elementId: string) {
    if (this.selectedPageForLayers === null) return;
    const page = this.pages[this.selectedPageForLayers];
    const elementIndex = page.elements.findIndex(el => el.id === elementId);
    if (elementIndex > 0) {
      // Swap with previous element
      const newElements = [...page.elements];
      [newElements[elementIndex], newElements[elementIndex - 1]] = 
        [newElements[elementIndex - 1], newElements[elementIndex]];
      
      // Update z-index values
      newElements.forEach((element, index) => {
        element.zIndex = index;
      });
      
      // Update the page
      this.canvasService.updatePageElements(this.selectedPageForLayers, newElements);
      setTimeout(() => this.initAllCanvases());
    }
  }

  moveLayerDown(elementId: string) {
    if (this.selectedPageForLayers === null) return;
    const page = this.pages[this.selectedPageForLayers];
    const elementIndex = page.elements.findIndex(el => el.id === elementId);
    if (elementIndex < page.elements.length - 1) {
      // Swap with next element
      const newElements = [...page.elements];
      [newElements[elementIndex], newElements[elementIndex + 1]] = 
        [newElements[elementIndex + 1], newElements[elementIndex]];
      
      // Update z-index values
      newElements.forEach((element, index) => {
        element.zIndex = index;
      });
      
      // Update the page
      this.canvasService.updatePageElements(this.selectedPageForLayers, newElements);
      setTimeout(() => this.initAllCanvases());
    }
  }

  getSortedElements(pageIndex: number): CanvasElement[] {
    if (pageIndex < 0 || pageIndex >= this.pages.length) return [];
    return [...this.pages[pageIndex].elements].sort((a, b) => a.zIndex - b.zIndex);
  }

  hasTemplateElements(): boolean {
    return this.pages.some(page => 
      page.elements.some(element => element.isTemplate === true)
    );
  }

  unlockAllTemplateElements() {
    // Unlock all template elements across all pages
    for (let pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
      const page = this.pages[pageIndex];
      const updatedElements = page.elements.map(element => {
        if (element.isTemplate === true) {
          return { ...element, locked: false };
        }
        return element;
      });
      
      this.canvasService.updatePageElements(pageIndex, updatedElements);
    }
    
    // Refresh the canvas to update all visual elements
    setTimeout(() => this.initAllCanvases());
  }

  openSaveTemplateModal() {
    this.newTemplateName = '';
    this.newTemplatePreviewUrl = '';
    this.showSaveTemplateModal = true;
  }

  saveCurrentAsTemplate() {
    this.isSavingTemplate = true;
    
    // Handle preview URL - keep as is if it's a blob URL
    const processPreviewUrl = async () => {
      if (this.newTemplatePreviewUrl && this.newTemplatePreviewUrl.startsWith('blob:')) {
        // For blob URLs, we need to convert to base64 for persistence
        // since blob URLs are temporary and won't work after page refresh
        try {
          const response = await fetch(this.newTemplatePreviewUrl);
          const blob = await response.blob();
          return await this.blobToBase64(blob);
        } catch (error) {
          console.error('Error converting preview URL to base64:', error);
          return 'assets/template-default.png';
        }
      }
      return this.newTemplatePreviewUrl || 'assets/template-default.png';
    };

    const elements = this.pages[this.selectedPageIndex].elements.map(async e => {
      // Remove runtime-only properties
      const { id, isTemplate, locked, ...rest } = e;
      
      // For image elements, keep blob URLs as they are
      // The blob URLs will be handled by the FileUploadService for persistence
      if (e.type === 'image' && e.imageUrl) {
        return { 
          ...rest, 
          type: e.type, 
          x: e.x, 
          y: e.y, 
          width: e.width, 
          height: e.height, 
          rotation: e.rotation, 
          zIndex: e.zIndex,
          imageUrl: e.imageUrl // Keep the original URL (blob or otherwise)
        };
      }
      
      return { 
        ...rest, 
        type: e.type, 
        x: e.x, 
        y: e.y, 
        width: e.width, 
        height: e.height, 
        rotation: e.rotation, 
        zIndex: e.zIndex 
      };
    });

    // Wait for all async operations to complete
    Promise.all([processPreviewUrl(), ...elements]).then(([previewUrl, ...processedElements]) => {
      const newTemplate: CanvasTemplate = {
        name: this.newTemplateName,
        previewUrl: previewUrl,
        elements: processedElements as any
      };
      const userTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]');
      userTemplates.push(newTemplate);
      localStorage.setItem('userTemplates', JSON.stringify(userTemplates));
      this.showSaveTemplateModal = false;
      this.isSavingTemplate = false;
      this.loadTemplates();
    }).catch(error => {
      console.error('Error saving template:', error);
      this.isSavingTemplate = false;
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  loadTemplates() {
    const builtIn = this.templateService.getTemplates();
    const userTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]');
    this.userTemplates = userTemplates;
    this.allTemplates = [...builtIn, ...userTemplates];
  }

  isUserTemplate(template: CanvasTemplate): boolean {
    return this.userTemplates.some(t => t.name === template.name && t.previewUrl === template.previewUrl);
  }

  deleteUserTemplate(template: CanvasTemplate) {
    let userTemplates = JSON.parse(localStorage.getItem('userTemplates') || '[]');
    userTemplates = userTemplates.filter(
      (t: CanvasTemplate) => !(t.name === template.name && t.previewUrl === template.previewUrl)
    );
    localStorage.setItem('userTemplates', JSON.stringify(userTemplates));
    this.loadTemplates();
  }


  public isMobileView: boolean = false;

  @HostListener('window:resize', ['$event'])
  
  private checkScreenSize(): void {
    const screenWidth = window.innerWidth;
    this.isMobileView = screenWidth <= 768;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  clearTextToolbarElement(): void {
    this.textToolbarElement = {
      id: 'default-text-toolbar',
      type: 'text',
      x: 0,
      y: 0,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: 0,
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      align: 'left',
      letterSpacing: 0,
      lineHeight: 1.5,
      locked: false
    };
  }

  updateTextToolbarElement(el: CanvasElement | null): void {
    if (el) {
      this.textToolbarElement = { ...el };
    } else {
      this.textToolbarElement = {
        id: 'default-text-toolbar',
        type: 'text',
        x: 0,
        y: 0,
        width: 200,
        height: 50,
        rotation: 0,
        zIndex: 0,
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#000000',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        align: 'left',
        letterSpacing: 0,
        lineHeight: 1.5,
        locked: false
      };
    }
  }
}