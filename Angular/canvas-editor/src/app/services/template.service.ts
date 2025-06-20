import { Injectable } from '@angular/core';
import { CanvasElement } from './canvas.service';

export interface CanvasTemplate {
  name: string;
  previewUrl: string;
  elements: CanvasElement[];
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private templates: CanvasTemplate[] = [
    {
      name: 'Dark Blue White Professional Business Presentation',
      previewUrl: "assets/BusinessProposal1.png", // Add your preview image here
      elements: [
        // Background
        
        // Top-right purple shapes
        {
          id: 'top-right-main',
          type: 'rect',
          x: 600,
          y: -20,
          width: 200,
          height: 80,
          rotation: 20,
          zIndex: 1,
          fill: '#6b5bd8',
          stroke: '#6b5bd8',
          strokeWidth: 0,
          opacity: 1,
          borderRadius: 16
        },
        {
          id: 'top-right-accent',
          type: 'rect',
          x: 670,
          y: 20,
          width: 100,
          height: 30,
          rotation: 25,
          zIndex: 2,
          fill: '#3b378c',
          stroke: '#3b378c',
          strokeWidth: 0,
          opacity: 1,
          borderRadius: 8
        },
        // Left vertical line
        {
          id: 'left-line',
          type: 'rect',
          x: 60,
          y: 50,
          width: 4,
          height: 380,
          rotation: 0,
          zIndex: 2,
          fill: '#2d3561',
          stroke: '#2d3561',
          strokeWidth: 0,
          opacity: 1,
          borderRadius: 2
        },
        // Logo (circle + text)
        {
          id: 'logo-name',
          type: 'text',
          x: 20,
          y: 20,
          width: 120,
          height: 30,
          rotation: 0,
          zIndex: 3,
          text: 'Company Logo',
          fontSize: 16,
          color: '#2d3561',
          fontWeight: 'normal'
        },
        {
          id: 'logo-text',
          type: 'text',
          x: 70,
          y: 75,
          width: 220,
          height: 30,
          rotation: 0,
          zIndex: 4,
          text: 'Business Industry',
          fontSize: 16,
          color: '#2d3561',
          fontWeight: 'normal'
        },
        // Main Title
        {
          id: 'main-title',
          type: 'text',
          x: 120,
          y: 120,
          width: 500,
          height: 80,
          rotation: 0,
          zIndex: 5,
          text: 'Business Proposal\nPresentation',
          fontSize: 36,
          color: '#2d3561',
          fontWeight: 'normal',
          fontFamily: 'serif'
        },
        // Subtitle
        {
          id: 'subtitle',
          type: 'text',
          x: 120,
          y: 210,
          width: 400,
          height: 30,
          rotation: 0,
          zIndex: 6,
          text: 'Product Research Proposal for Ingoude Company',
          fontSize: 18,
          color: '#2d3561',
          fontWeight: 'normal'
        },
        // Date
        {
          id: 'date',
          type: 'text',
          x: 120,
          y: 250,
          width: 200,
          height: 24,
          rotation: 0,
          zIndex: 7,
          text: '02 May, 2024',
          fontSize: 16,
          color: '#2d3561',
          fontWeight: 'normal'
        }
      ]
    },
    {
      name: 'Green Modern Corporate Presentation ',
      previewUrl: "assets/BusinessProposal2.png", // Add your preview image here
      elements: [

        // Top-right light gray rectangle
        {
          id: 'top-right-accent',
          type: 'rect',
          x: 500,
          y: 0,
          width: 260,
          height: 70,
          rotation: 0,
          zIndex: 1,
          fill: '#eaeae5',
          stroke: '#eaeae5',
          strokeWidth: 0,
          opacity: 1,
          borderRadius: 0
        },
        // Bottom-left light gray rectangle
        {
          id: 'bottom-left-accent',
          type: 'rect',
          x: 0,
          y: 370,
          width: 220,
          height: 70,
          rotation: 0,
          zIndex: 1,
          fill: '#eaeae5',
          stroke: '#eaeae5',
          strokeWidth: 0,
          opacity: 1,
          borderRadius: 0
        },
        // Left vertical dot line
        {
          id: 'compnay-logo',
          type: 'text',
          x: 30,
          y: 40,
          width: 180,
          height: 18,
          rotation: 0,
          zIndex: 2,
          text: 'Company Logo',
          fontSize: 18,
          color: '#6b7657',
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          align: 'center'
        },
        // Main Title
        {
          id: 'main-title',
          type: 'text',
          x: 120,
          y: 120,
          width: 540,
          height: 120,
          rotation: 0,
          zIndex: 4,
          text: 'BUSINESS PROPOSAL\nPRESENTATION',
          fontSize: 44,
          color: '#6b7657',
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
          align: 'center'
        },
        // Subtitle
        {
          id: 'subtitle',
          type: 'text',
          x: 150,
          y: 250,
          width: 480,
          height: 30,
          rotation: 0,
          zIndex: 5,
          text: 'Product Research Proposal for Ingoude Company',
          fontSize: 20,
          color: '#222',
          fontWeight: 'normal',
          fontFamily: 'sans-serif',
          align: 'center'
        },
        // Date
        {
          id: 'date',
          type: 'text',
          x: 600,
          y: 390,
          width: 180,
          height: 24,
          rotation: 0,
          zIndex: 6,
          text: '02 May, 2024',
          fontSize: 16,
          color: '#6b7657',
          fontWeight: 'normal',
          fontFamily: 'sans-serif',
          align: 'center'
        },
        // Right dotted line
        {
          id: 'right-dots',
          type: 'rect',
          x: 720,
          y: 120,
          width: 4,
          height: 180,
          rotation: 0,
          zIndex: 7,
          fill: 'repeating-linear-gradient(to bottom, #b7bead 0 8px, transparent 8px 16px)',
          stroke: 'transparent',
          strokeWidth: 0,
          opacity: 1,
          borderRadius: 2
        }
      ]
    }
  ];

  getTemplates(): CanvasTemplate[] {
    return this.templates;
  }
}