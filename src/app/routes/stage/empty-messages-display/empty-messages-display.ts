import { Component } from '@angular/core';

@Component({
  selector: 'tk-empty-messages-display',
  imports: [],
  templateUrl: './empty-messages-display.html',
  host: {
    class: 'flex items-center justify-center h-full text-white/60',
  },
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyMessagesDisplay {}
