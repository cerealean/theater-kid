import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[tkSpotlight]',
  standalone: true,
})
export class SpotlightDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent) {
    const r = this.el.nativeElement.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - r.left, r.width));
    const y = Math.max(0, Math.min(e.clientY - r.top, r.height));
    this.el.nativeElement.style.setProperty('--mx', `${x}px`);
    this.el.nativeElement.style.setProperty('--my', `${y}px`);
  }
  @HostListener('pointerleave')
  onLeave() {
    this.el.nativeElement.style.setProperty('--mx', '50%');
    this.el.nativeElement.style.setProperty('--my', '20%');
  }
}
