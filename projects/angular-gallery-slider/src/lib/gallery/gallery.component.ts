import {
  animate,
  AnimationBuilder,
  AnimationMetadata,
  AnimationPlayer,
  style,
} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { constants } from './constants';
import { GalleryTemplateDirective } from './gallery-template.directive';

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
export class GalleryComponent<T> implements AfterViewInit {
  activeIndex = constants.BASE_INDEX;

  @Input() value: T[] = [];

  private _itemSize = 0;
  @Input() set itemSize(value: number) {
    this._itemSize = value;
    this.updateSize(value);
  }

  @HostBinding('style')
  get initialStyles() {
    return this.galleryStyles();
  }

  @HostListener('window:resize')
  onResize() {
    this.resize();
  }

  @ViewChild('slider', { static: false })
  private sliderReference?: ElementRef<HTMLDivElement>;

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

  ngAfterViewInit() {
    this.updateSetting(
      'defaultGallerySliderWidth',
      this.getActiveElement()?.clientWidth ?? constants.GALLERY_SLIDER_WIDTH
    );

    this.resize();
  }

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
        }); // if it reached the endTranslateMiddleIndex it means we are at the end and we should stop translating.
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

  private updateSetting<T>(key: keyof GallerySettings, value: T) {
    this.settings = {
      ...this.settings,
      [key]: value,
    };
  }

  private updateSize(size = this.settings.itemSize) {
    const { defaultGallerySliderWidth } = this.settings;

    const updatedSize = size > this.value.length ? this.value.length : size;
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
      `max-inline-size: ${this.settings.containerWidth}px`
    );
  }

  private resize() {
    const calcuatedItemSize = Math.floor(
      window.innerWidth / this.settings.defaultGallerySliderWidth
    );

    const finalItemSize =
      calcuatedItemSize > this._itemSize ? this._itemSize : calcuatedItemSize;

    this.updateSize(finalItemSize);

    this.select(this.sliderReference!.nativeElement, this.activeIndex);
  }

  private getActiveElement(): HTMLDivElement | undefined {
    const slider = this.sliderReference?.nativeElement;

    return ([].slice.call(slider?.children) as HTMLDivElement[]).find(
      ({ classList }) => classList.contains('active')
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
