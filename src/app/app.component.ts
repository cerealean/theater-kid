import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'tk-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent {}
