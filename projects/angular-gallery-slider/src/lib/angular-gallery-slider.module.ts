import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GalleryTemplateDirective } from './gallery/gallery-template.directive';
import { GalleryComponent } from './gallery/gallery.component';

@NgModule({
  declarations: [GalleryComponent, GalleryTemplateDirective],
  imports: [CommonModule],
  exports: [CommonModule, GalleryComponent, GalleryTemplateDirective],
})
export class AngularGallerySliderModule {}
