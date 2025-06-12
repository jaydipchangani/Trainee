import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasEditorComponent } from './components/canvas-editor/canvas-editor.component';
import { ViewOnlyComponent } from './components/view-only/view-only.component';

const routes: Routes = [
  { path: '', component: CanvasEditorComponent },
  { path: 'view/:data', component: ViewOnlyComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
