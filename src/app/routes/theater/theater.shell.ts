import { Component, DOCUMENT, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Spotlight } from '../../core/directives/spotlight';
import { ConfigService } from '../../core/services/config.service';

@Component({
  standalone: true,
  selector: 'tk-theater',
  imports: [RouterLink, RouterOutlet, CommonModule, Spotlight],
  templateUrl: './theater.shell.html',
})
export class TheaterShell {
  private config = inject(ConfigService);
  private document = inject(DOCUMENT);

  theme = signal<'dark' | 'light'>(this.config.theme());
  isSideMenuOpen = signal<boolean>(false);

  constructor() {
    this.document.documentElement.setAttribute('data-theme', this.theme());
  }

  toggleTheme() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(newTheme);
    this.config.theme.set(newTheme);
    this.document.documentElement.setAttribute('data-theme', newTheme);
  }

  toggleSideMenu() {
    this.isSideMenuOpen.set(!this.isSideMenuOpen());
  }

  closeSideMenu() {
    this.isSideMenuOpen.set(false);
  }
}
