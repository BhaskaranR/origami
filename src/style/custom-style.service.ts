import { ElementRef, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class CustomStyleService {
  constructor(@Inject(DOCUMENT) private dom: any) { }

  updateCustomStyles(nativeEncapsulatedHost?: ElementRef) {
    // TODO: Determine if head styles need wrapped more than once. I.e does Angular ever append
    // <style>s to head dynamically.
    this.wrapHeadStyles();
    if (nativeEncapsulatedHost && nativeEncapsulatedHost.nativeElement.shadowRoot) {
      this.wrapStyles(nativeEncapsulatedHost.nativeElement.shadowRoot.querySelectorAll('style'));
    }
  }

  private wrapHeadStyles() {
    this.wrapStyles(this.dom.head.querySelectorAll('head > style'));
  }

  private wrapStyles(styles: NodeListOf<Element>) {
    Array.from(styles).forEach(style => {
      this.wrapCustomStyle(<HTMLStyleElement>style);
    });
  }

  private wrapCustomStyle(styleEl: HTMLStyleElement) {
    const parent = styleEl.parentNode;
    const sibling = styleEl.nextSibling;
    parent.removeChild(styleEl);
    const customStyle = this.dom.createElement('custom-style');
    customStyle.appendChild(styleEl);
    if (sibling) {
      parent.insertBefore(customStyle, sibling);
    } else {
      parent.appendChild(customStyle);
    }
  }
}
