import {
  animate,
  AnimationBuilder,
  AnimationMetadata,
  AnimationPlayer,
  style,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { constants } from './constants';
import { GalleryTemplateDirective } from './gallery-template.directive';
import { getUpdatedSize } from './helpers';

@Component({
  selector: 'gl-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gl-gallery',
  },
})
export class GalleryComponent<T> {
  activeIndex = constants.BASE_INDEX;

  @Input() value: T[] = [];

  @Input() set previewSize(value: number) {
    this.updateHeight(value);
  }

  @Input() set itemSize(value: number) {
    this.updateSize(value);
  }

  @HostBinding('style')
  get initialStyles() {
    return this.galleryStyles();
  }

  @ContentChildren(GalleryTemplateDirective, { read: GalleryTemplateDirective })
  set template(templateList: QueryList<GalleryTemplateDirective>) {
    this.templateList = templateList.toArray();
  }
  private templateList: GalleryTemplateDirective[] = [];

  readonly PREVIEW = constants.TEMPLATE.PREVIEW;

  readonly ITEM = constants.TEMPLATE.ITEM;

  private settings: GallerySettings = {
    itemSize: constants.BASE_ITEM_SIZE,
    height: constants.BASE_HEIGHT,
    elementMiddlePosition: Math.floor(constants.BASE_ITEM_SIZE / 2),
    defaultGallerySliderWidth: constants.GALLERY_SLIDER_WIDTH,
    translatePercentage:
      (constants.GALLERY_SLIDER_WIDTH /
        (constants.BASE_ITEM_SIZE * constants.GALLERY_SLIDER_WIDTH)) *
      100, // item width / container * 100 will give us correct item translate percentage
    containerWidth: constants.BASE_ITEM_SIZE * constants.GALLERY_SLIDER_WIDTH,
  };

  constructor(
    private builder: AnimationBuilder,
    private sanitizer: DomSanitizer
  ) {}

  prev(slider: HTMLDivElement) {
    this.select(
      slider,
      this.activeIndex === 0 ? this.value.length - 1 : this.activeIndex - 1
    );
  }

  next(slider: HTMLDivElement) {
    this.select(slider, (this.activeIndex + 1) % this.value.length);
  }

  select(slider: HTMLDivElement, index: number) {
    this.activeIndex = index;

    const { elementMiddlePosition, translatePercentage, itemSize } =
      this.settings;

    const isEven = itemSize % 2 === 0;
    const activeTranslateIndex = this.activeIndex - elementMiddlePosition; // default translate index. has to start from element middle index.
    const endTranslateIndex =
      (isEven ? this.value.length : this.value.length - 1) -
      elementMiddlePosition; // very end translate index.
    const endTranslateMiddleIndex = endTranslateIndex - elementMiddlePosition; // end middle translate index.

    if (this.activeIndex < elementMiddlePosition) {
      // if active index hasn't even reached elementMiddlePosition, we should not start translating and translate index will be always 0.
      this.translate({
        translatePercentage,
        translateIndex: 0,
        element: slider,
      });
    } else {
      if (activeTranslateIndex <= endTranslateMiddleIndex) {
        this.translate({
          translatePercentage,
          translateIndex: activeTranslateIndex,
          element: slider,
        });
      } else {
        this.translate({
          translatePercentage,
          translateIndex: endTranslateMiddleIndex,
          element: slider,
        }); // if it reached endTranslateMiddleIndex we are at the end and we should stop translating.
      }
    }
  }

  get selectedImagePreview(): T {
    return this.value[this.activeIndex];
  }

  getTemplate(templateName: string): GalleryTemplateDirective {
    return this.templateList.filter((t) => t.templateName === templateName)[0];
  }

  hasTemplateName(templateName: string): boolean {
    return this.templateList.some((s) => s.templateName === templateName);
  }

  private updateSize(size = this.settings.itemSize) {
    const { defaultGallerySliderWidth } = this.settings;

    const updatedSize = getUpdatedSize(size, this.value.length);
    const updatedContainerWidth = defaultGallerySliderWidth * updatedSize;

    this.settings = {
      ...this.settings,
      itemSize: updatedSize,
      elementMiddlePosition: Math.floor(updatedSize / 2),
      translatePercentage:
        (defaultGallerySliderWidth / updatedContainerWidth) * 100,
      containerWidth: updatedContainerWidth,
    };
  }

  private updateHeight(height = this.settings.height) {
    this.settings = {
      ...this.settings,
      height,
    };
  }

  private animate(
    animationMetaData: AnimationMetadata | AnimationMetadata[],
    el: HTMLElement
  ): AnimationPlayer {
    const animation = this.builder.build(animationMetaData);
    const player = animation.create(el);
    player.play();

    return player;
  }

  private translate({
    translatePercentage,
    translateIndex,
    element,
  }: {
    translatePercentage: number;
    translateIndex: number;
    element: HTMLElement;
  }) {
    this.animate(
      animate(
        constants.DEFAULT_EASE,
        style({
          transform: `translateX(-${translatePercentage * translateIndex}%)`,
        })
      ),
      element
    );
  }

  private galleryStyles(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      `inline-size: ${this.settings.containerWidth}px;
      grid-template-rows: ${this.settings.height}px auto;`
    );
  }
}

export interface GallerySettings {
  containerWidth: number;
  height: number;
  itemSize: number;
  elementMiddlePosition: number;
  translatePercentage: number;
  defaultGallerySliderWidth: number;
}
