<p align="center">
  <h1 align="center">Minimal Angular Gallery Slider</h1>
</p>

[![Support](https://img.shields.io/badge/Support-Angular%2012%2B-blue.svg?style=flat-square)]()
[![Support](https://img.shields.io/badge/Support-Angular%2013%2B-blue.svg?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)]()
 
[paypal]: https://img.shields.io/badge/-donate-blue.svg?logo=paypal
[![paypal]](https://www.paypal.me/bekaam)

## What's New
- Responsive gallery
- Bug fixes


## Table of contents

- [What's New](#whats-new)
- [Table of contents](#table-of-contents)
- [Features](#features)
- [Demo](#demo)
  - [StackBlitz Demo](#stackblitz-demo)
- [Installation](#installation)
- [Usage](#usage)
- [Available Options](#available-options)
- [Versioning](#versioning)
- [Future Plan](#versioning)
- [Creator](#creator)
  - [Beka Maisuradze](#beka-maisuradze)
- [Ask Me](#ask-me)
  - [License](#license)


## Features

- **Angular 13** Support
- Responsive gallery
- Smooth sliding with @angular/animations
- Fully reusable component
- Small bundle size

## Demo


### StackBlitz Demo

- [Normal Usage](https://stackblitz.com/edit/angular-ivy-v2hdpm)



## Installation

`angular-gallery-slider` is available via [npm](https://www.npmjs.com/package/angular-gallery-slider)

Using npm:

```bash
$ npm install angular-gallery-slider
```

## Usage

Import `AngularGallerySliderModule` and `BrowserAnimationsModule` in the root module(`AppModule`):

```typescript
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularGallerySliderModule } from  'angular-gallery-slider';

@NgModule({
  imports: [
    // ...
    BrowserAnimationsModule, 
    AngularGallerySliderModule
  ],
})
export class AppModule {}
```

**Template usage example**

It is possible to customize slider image using templating. The ngTemplate receives the `item` as the implicit variable. `preview` template is used for displaying preview image. `item` template is used to displaying the slider image item. 

```html
<gl-gallery [value]="data" [itemSize]="5">
	<ng-template template="preview" let-data>
		<img src="{{ data.previewImageSource }}" alt="preview"/>
	</ng-template>
	<ng-template template="item" let-data>
		<img src="{{ data.imageSource }}" alt="image" style="block-size: 100px; inline-size: 100px;"/>
	</ng-template>
</gl-gallery>
```

## Available properties

- **[value]**: An array of objects to display as gallery items.
- **[itemSize]**:  Used for specifying how many number of slider items can be shown in gallery. (Note: the preview image size is automatically calculated based on itemSize and it is recommended to avoid setting custom height or width on a preview image)

## Versioning

angular-gallery-slider is maintained under the Semantic Versioning guidelines.
Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

For more information on SemVer, please visit http://semver.org.

## Future Plan
- Accessibility (keyboard navigation support)
- New properties to have more control over gallery
- Exposing `next` and `prev` handlers

## Creator

#### [Beka Maisuradze](mailto:maisuradzebeka0@gmail.com)

- [@GitHub](https://github.com/bekamais)

## Ask Me

- Send me questions on  [Email](mailto:maisuradzebeka0@gmail.com) 

### License

[MIT license](./LICENSE)
