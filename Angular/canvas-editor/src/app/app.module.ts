import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasEditorComponent } from './components/canvas-editor/canvas-editor.component';
import { ViewOnlyComponent } from './components/view-only/view-only.component';
import { CanvasService } from './services/canvas.service';
import { HtmlGeneratorService } from './services/html-generator.service';

@NgModule({
  declarations: [
    AppComponent,
    CanvasEditorComponent,
    ViewOnlyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    CanvasService,
    HtmlGeneratorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
