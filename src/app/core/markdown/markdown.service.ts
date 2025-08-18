import { Injectable, inject } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MarkdownService {
  private sanitizer = inject(DomSanitizer);

  constructor() {
    // Configure marked for better security
    marked.setOptions({
      breaks: true,
    });
  }

  render(markdown: string): SafeHtml {
    if (!markdown?.trim()) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    try {
      const html = marked.parse(markdown) as string;

      // Basic HTML sanitization - remove script tags and dangerous attributes
      const sanitizedHtml = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/javascript:/gi, '');

      return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
  }
}
