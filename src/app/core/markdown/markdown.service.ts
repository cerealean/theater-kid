import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Injectable({ providedIn: 'root' })
export class MarkdownService {
  constructor(private sani: DomSanitizer) { marked.setOptions({ breaks: true }); }
  render(md: string): SafeHtml {
    const html = marked.parse(md ?? '') as string;
    return this.sani.bypassSecurityTrustHtml(html);
  }
}