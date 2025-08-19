import { Directive, ElementRef, HostListener, inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, throttleTime } from 'rxjs';

@Directive({
  selector: '[tkSpotlight]',
  standalone: true,
})
export class SpotlightDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly pointerMove$ = new Subject<PointerEvent>();
  private nativeElement: HTMLElement = this.el.nativeElement;

  @HostListener('pointermove', ['$event'])
  onMove(e: PointerEvent) {
    this.pointerMove$.next(e);
  }

  @HostListener('pointerleave')
  onLeave() {
    this.nativeElement.style.setProperty('--mx', '50%');
    this.nativeElement.style.setProperty('--my', '20%');
  }

  constructor() {
    this.pointerMove$.pipe(throttleTime(16), takeUntilDestroyed()).subscribe((event) => {
      const r = this.nativeElement.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - r.left, r.width));
      const y = Math.max(0, Math.min(event.clientY - r.top, r.height));
      this.nativeElement.style.setProperty('--mx', `${x}px`);
      this.nativeElement.style.setProperty('--my', `${y}px`);
    });
  }

  ngOnDestroy(): void {
    this.pointerMove$.complete();
  }
}
