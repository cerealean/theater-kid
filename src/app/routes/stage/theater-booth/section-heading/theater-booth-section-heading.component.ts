import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tk-theater-booth-section-heading',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tk-theater-booth-section-heading',
    role: 'heading',
    'aria-level': '2',
  },
})
export class TheaterBoothSectionHeadingComponent {}
