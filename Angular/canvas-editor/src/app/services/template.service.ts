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
      name: 'Modern Frame',
      previewUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', // Unique image 1
      elements: [
        {
          id: 'frame-bg',
          type: 'rect',
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          zIndex: 0,
          fill: '#f0f0f0',
          stroke: '#666',
          strokeWidth: 10,
          opacity: 1,
          borderRadius: 12
        },
        {
          id: 'frame-inner',
          type: 'rect',
          x: 20,
          y: 20,
          width: 760,
          height: 560,
          rotation: 0,
          zIndex: 1,
          fill: '#fff',
          stroke: '#fff',
          strokeWidth: 0,
          opacity: 1,
          borderRadius: 6
        }
      ]
    },
    {
      name: 'Sales Proposal',
      previewUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', // Unique image 2
      elements: [
        {
          id: 'bg',
          type: 'rect',
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          zIndex: 0,
          fill: 'linear-gradient(180deg, #e9a17b 0%, #fff 100%)',
          stroke: '#b86b4b',
          strokeWidth: 8,
          opacity: 1,
          borderRadius: 16
        },
        {
          id: 'logo',
          type: 'text',
          x: 32,
          y: 32,
          width: 300,
          height: 30,
          rotation: 0,
          zIndex: 1,
          text: 'Innovative Company',
          fontSize: 18,
          color: '#222',
          fontWeight: 'normal'
        },
        {
          id: 'title',
          type: 'text',
          x: 40,
          y: 120,
          width: 700,
          height: 120,
          rotation: 0,
          zIndex: 2,
          text: 'Sales Proposal',
          fontSize: 80,
          color: '#222',
          fontWeight: 'normal'
        },
        {
          id: 'button',
          type: 'rect',
          x: 48,
          y: 270,
          width: 140,
          height: 40,
          rotation: 0,
          zIndex: 3,
          fill: '#fff',
          stroke: '#222',
          strokeWidth: 2,
          opacity: 1,
          borderRadius: 20
        },
        {
          id: 'button-text',
          type: 'text',
          x: 68,
          y: 278,
          width: 100,
          height: 30,
          rotation: 0,
          zIndex: 4,
          text: 'LEARN MORE',
          fontSize: 16,
          color: '#222',
          fontWeight: 'normal'
        },
        {
          id: 'author',
          type: 'text',
          x: 600,
          y: 290,
          width: 180,
          height: 30,
          rotation: 0,
          zIndex: 5,
          text: 'BY MAEVA AHEARN\nSALES REPRESENTATIVE',
          fontSize: 12,
          color: '#222',
          fontWeight: 'normal'
        }
      ]
    },
    {
      name: 'Company Profile',
      previewUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', // Unique image 3
      elements: [
        {
          id: 'bg',
          type: 'rect',
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          zIndex: 0,
          fill: '#fff',
          stroke: '#e0e0e0',
          strokeWidth: 2,
          opacity: 1,
          borderRadius: 16
        },
        {
          id: 'blue-shape',
          type: 'rect',
          x: 0,
          y: 0,
          width: 320,
          height: 600,
          rotation: 25,
          zIndex: 1,
          fill: '#3b5b8c',
          stroke: '#3b5b8c',
          strokeWidth: 0,
          opacity: 0.15,
          borderRadius: 120
        },
        {
          id: 'logo',
          type: 'text',
          x: 32,
          y: 32,
          width: 300,
          height: 30,
          rotation: 0,
          zIndex: 2,
          text: 'ADD COMPANY NAME',
          fontSize: 18,
          color: '#222',
          fontWeight: 'bold'
        },
        {
          id: 'title',
          type: 'text',
          x: 400,
          y: 180,
          width: 350,
          height: 80,
          rotation: 0,
          zIndex: 3,
          text: 'Company',
          fontSize: 60,
          color: '#222',
          fontWeight: 'bold'
        },
        {
          id: 'subtitle',
          type: 'text',
          x: 400,
          y: 250,
          width: 350,
          height: 60,
          rotation: 0,
          zIndex: 4,
          text: 'Profile',
          fontSize: 48,
          color: '#6b8bbd',
          fontWeight: 'bold'
        },
        {
          id: 'desc',
          type: 'text',
          x: 400,
          y: 320,
          width: 350,
          height: 40,
          rotation: 0,
          zIndex: 5,
          text: 'Write company name here',
          fontSize: 20,
          color: '#222',
          fontWeight: 'normal'
        }
      ]
    }
  ];

  getTemplates(): CanvasTemplate[] {
    return this.templates;
  }
} 