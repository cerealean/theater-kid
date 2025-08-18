import { Component, DOCUMENT, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Spotlight } from '../../core/directives/spotlight';
import { ConfigService } from '../../core/services/config.service';

@Component({
  standalone: true,
  selector: 'app-theater',
  imports: [RouterLink, RouterOutlet, CommonModule, Spotlight],
  templateUrl: './theater.shell.html',
})
export class TheaterShell {
  private config = inject(ConfigService);
  private document = inject(DOCUMENT);

  theme = signal<'dark' | 'light'>(this.config.getTheme());

  constructor() {
    this.document.documentElement.setAttribute('data-theme', this.theme());
  }

  toggleTheme() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(newTheme);
    this.config.setTheme(newTheme);
    this.document.documentElement.setAttribute('data-theme', newTheme);
  }
}
