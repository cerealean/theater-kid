import { Component, DOCUMENT, Inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'tk-theater',
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './theater.shell.html',
})
export class TheaterShell {
  theme = signal<'dark' | 'light'>((localStorage.getItem('tk:theme') as any) || 'dark');

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document.documentElement.setAttribute('data-theme', this.theme());
  }

  toggleTheme() {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
    this.document.documentElement.setAttribute('data-theme', this.theme());
    localStorage.setItem('tk:theme', this.theme());
  }
}
