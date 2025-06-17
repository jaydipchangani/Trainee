import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  dataUrl?: string; // Store base64 data for persistence
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService implements OnDestroy {
  private readonly STORAGE_KEY = 'uploaded_files';
  private uploadedFiles: UploadedFile[] = [];

  constructor() {
    this.loadUploadedFiles();
  }

  ngOnDestroy(): void {
    this.clearAllFiles();
  }

  private loadUploadedFiles(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const storedFiles = JSON.parse(stored).map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        }));
        
        // Recreate object URLs from stored data
        this.uploadedFiles = storedFiles.map((file: UploadedFile) => {
          if (file.dataUrl) {
            // Convert base64 back to blob and create new object URL
            const byteCharacters = atob(file.dataUrl.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: file.type });
            const objectUrl = URL.createObjectURL(blob);
            
            return {
              ...file,
              url: objectUrl
            };
          }
          return file;
        });
      }
    } catch (error) {
      console.error('Error loading uploaded files:', error);
      this.uploadedFiles = [];
    }
  }

  private saveUploadedFiles(): void {
    try {
      // Store files with base64 data for persistence
      const filesToStore = this.uploadedFiles.map(file => ({
        ...file,
        url: undefined // Don't store object URLs
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filesToStore));
    } catch (error) {
      console.error('Error saving uploaded files:', error);
    }
  }

  uploadFile(file: File): Observable<UploadedFile> {
    return new Observable(observer => {
      // Create a unique ID for the file
      const fileId = this.generateFileId();
      
      // Create object URL for immediate use
      const objectUrl = URL.createObjectURL(file);
      
      // Convert to base64 for persistence
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          url: objectUrl,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          dataUrl: dataUrl
        };

        // Add to our list
        this.uploadedFiles.push(uploadedFile);
        this.saveUploadedFiles();

        observer.next(uploadedFile);
        observer.complete();
      };
      reader.readAsDataURL(file);
    });
  }

  uploadMultipleFiles(files: File[]): Observable<UploadedFile[]> {
    return new Observable(observer => {
      const uploadedFiles: UploadedFile[] = [];
      let processedCount = 0;
      
      files.forEach(file => {
        const fileId = this.generateFileId();
        const objectUrl = URL.createObjectURL(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          
          const uploadedFile: UploadedFile = {
            id: fileId,
            name: file.name,
            url: objectUrl,
            type: file.type,
            size: file.size,
            uploadedAt: new Date(),
            dataUrl: dataUrl
          };

          uploadedFiles.push(uploadedFile);
          this.uploadedFiles.push(uploadedFile);
          
          processedCount++;
          if (processedCount === files.length) {
            this.saveUploadedFiles();
            observer.next(uploadedFiles);
            observer.complete();
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  getUploadedFiles(): UploadedFile[] {
    return [...this.uploadedFiles];
  }

  deleteFile(fileId: string): void {
    const fileIndex = this.uploadedFiles.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      const file = this.uploadedFiles[fileIndex];
      // Revoke the object URL to free memory
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
      this.uploadedFiles.splice(fileIndex, 1);
      this.saveUploadedFiles();
    }
  }

  clearAllFiles(): void {
    // Revoke all object URLs
    this.uploadedFiles.forEach(file => {
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
    });
    this.uploadedFiles = [];
    this.saveUploadedFiles();
  }

  private generateFileId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
} 