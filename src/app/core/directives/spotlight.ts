import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Spotlight directive that creates a spotlight effect following the mouse cursor.
 * Updates CSS custom properties --mx and --my with the cursor position relative to the element.
 *
 * @example
 * ```html
 * <div tkSpotlight>Content with spotlight effect</div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[tkSpotlight]',
})
export class Spotlight {
  private elementRef = inject(ElementRef<HTMLElement>);

  /**
   * Handles pointer move events to update spotlight position
   * @param event - The pointer event containing cursor coordinates
   */
  @HostListener('pointermove', ['$event'])
  onMove(event: PointerEvent): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.elementRef.nativeElement.style.setProperty('--mx', `${x}px`);
    this.elementRef.nativeElement.style.setProperty('--my', `${y}px`);
  }
}
