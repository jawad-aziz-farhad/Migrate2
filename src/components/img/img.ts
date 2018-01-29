import { Component, Input, OnChanges } from '@angular/core';

/**
 * Generated class for the ImgComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-img',
  templateUrl: 'img.html'
})
export class ImgComponent implements OnChanges {
  @Input() 
  public src: string;
  @Input() 
  public default: string;
  @Input() 
  public alt: string ;
  public cached: boolean;
  public loaded : boolean;
  public error: boolean;

  private lastSrc: string;

  constructor() { 
    this.cached = this.loaded = this.error = false;
  }

  public ngOnChanges() {
      if (this.src !== this.lastSrc) {
          this.lastSrc = this.src;
          this.loaded = false;
          this.error = false;
          this.cached = this.isCached(this.src);
      }

      if (!this.src) {
          this.error = true;
      }
  }

  public onLoad() {
      this.loaded = true;
  }

  public onError() {
      this.error = true;
  }

  private isCached(url: string): boolean {
      if (!url) {
          return false;
      }

      let image = new Image();
      image.src = url;
      let complete = image.complete;

      // console.log('isCached', complete, url);

      return complete;
  }

}
