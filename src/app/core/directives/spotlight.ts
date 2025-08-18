import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[tkSpotlight]',
})
export class Spotlight {
  constructor(private el: ElementRef<HTMLElement>) { }
  
  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent) {
    const r = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    this.el.nativeElement.style.setProperty('--mx', `${x}px`);
    this.el.nativeElement.style.setProperty('--my', `${y}px`);
  }
}
