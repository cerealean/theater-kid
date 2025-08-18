import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MarkdownService } from './markdown.service';
import { marked } from 'marked';

describe('MarkdownService', () => {
  let service: MarkdownService;
  let domSanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    const domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);

    TestBed.configureTestingModule({
      providers: [MarkdownService, { provide: DomSanitizer, useValue: domSanitizerSpy }],
    });

    service = TestBed.inject(MarkdownService);
    domSanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;

    // Setup default spy behavior
    domSanitizer.bypassSecurityTrustHtml.and.returnValue('mocked-safe-html' as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('render', () => {
    it('should return empty safe HTML for null input', () => {
      service.render(null as any);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
    });

    it('should return empty safe HTML for undefined input', () => {
      service.render(undefined as any);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
    });

    it('should return empty safe HTML for empty string', () => {
      service.render('');

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
    });

    it('should return empty safe HTML for whitespace-only string', () => {
      service.render('   \n\t  ');

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
    });

    it('should render simple markdown text', () => {
      const markdown = 'Hello **world**!';
      service.render(markdown);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        jasmine.stringMatching(/<p>Hello <strong>world<\/strong>!<\/p>/),
      );
    });

    it('should render markdown headers', () => {
      const markdown = '# Heading 1\n## Heading 2';
      service.render(markdown);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        jasmine.stringMatching(/<h1>Heading 1<\/h1>\s*<h2>Heading 2<\/h2>/),
      );
    });

    it('should render markdown links', () => {
      const markdown = '[Google](https://google.com)';
      service.render(markdown);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        jasmine.stringMatching(/<a href="https:\/\/google\.com">Google<\/a>/),
      );
    });

    it('should render markdown lists', () => {
      const markdown = '- Item 1\n- Item 2\n- Item 3';
      service.render(markdown);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        jasmine.stringMatching(
          /<ul>\s*<li>Item 1<\/li>\s*<li>Item 2<\/li>\s*<li>Item 3<\/li>\s*<\/ul>/,
        ),
      );
    });

    it('should render code blocks', () => {
      const markdown = '```javascript\nconst x = 1;\n```';
      service.render(markdown);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        jasmine.stringMatching(
          /<pre><code class="language-javascript">const x = 1;\s*<\/code><\/pre>/,
        ),
      );
    });

    it('should render inline code', () => {
      const markdown = 'Use `console.log()` to debug';
      service.render(markdown);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        jasmine.stringMatching(/Use <code>console\.log\(\)<\/code> to debug/),
      );
    });

    it('should respect line breaks due to breaks: true option', () => {
      const markdown = 'Line 1\nLine 2';
      service.render(markdown);

      expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        jasmine.stringMatching(/Line 1<br>\s*Line 2/),
      );
    });

    describe('security features', () => {
      it('should remove script tags', () => {
        const markdown = 'Safe text <script>alert("xss")</script> more text';
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).toMatch(/Safe text\s+more text/);
        expect(sanitizedCall).not.toMatch(/<script/);
      });

      it('should remove script tags with attributes', () => {
        const markdown =
          'Text <script type="text/javascript" src="evil.js">alert("xss")</script> more';
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).not.toMatch(/<script/);
      });

      it('should remove script tags case-insensitively', () => {
        const markdown = 'Text <SCRIPT>alert("xss")</SCRIPT> more';
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).not.toMatch(/<SCRIPT/i);
      });

      it('should remove onclick handlers with double quotes', () => {
        const markdown = 'Click <button onclick="alert(\'xss\')">here</button>';
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).not.toMatch(/onclick=/);
      });

      it('should remove onclick handlers with single quotes', () => {
        const markdown = 'Click <button onclick=\'alert("xss")\'>here</button>';
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).not.toMatch(/onclick=/);
      });

      it('should remove various event handlers', () => {
        const markdown = '<div onload="evil()" onmouseover="bad()" onfocus="worse()">Content</div>';
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).not.toMatch(/on\w+=/i);
      });

      it('should remove javascript: URLs', () => {
        const markdown = '<a href="javascript:alert(\'xss\')">Click me</a>';
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).not.toMatch(/javascript:/i);
      });

      it('should remove javascript: URLs case-insensitively', () => {
        const markdown = '<a href="JAVASCRIPT:alert(\'xss\')">Click me</a>';
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).not.toMatch(/javascript:/i);
      });

      it('should handle multiple security threats in one input', () => {
        const markdown = `<script>alert("xss1")</script>
<button onclick="alert('xss2')">Button</button>
<a href="javascript:alert('xss3')">Link</a>
<div onmouseover="alert('xss4')">Hover</div>`;
        service.render(markdown);

        const sanitizedCall = domSanitizer.bypassSecurityTrustHtml.calls.mostRecent().args[0];
        expect(sanitizedCall).not.toMatch(/<script/i);
        expect(sanitizedCall).not.toMatch(/onclick=/i);
        expect(sanitizedCall).not.toMatch(/javascript:/i);
        expect(sanitizedCall).not.toMatch(/onmouseover=/i);
      });

      it('should preserve safe HTML attributes', () => {
        const markdown = '<div class="safe-class" id="safe-id">Content</div>';
        service.render(markdown);

        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/class="safe-class"/),
        );
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/id="safe-id"/),
        );
      });
    });

    describe('error handling', () => {
      it('should handle marked parsing errors gracefully', () => {
        // Spy on console.error to verify error logging
        spyOn(console, 'error');

        // Spy on marked.parse to throw an error
        spyOn(marked, 'parse').and.throwError('Parsing failed');

        const result = service.render('# Valid markdown');

        expect(console.error).toHaveBeenCalledWith('Error parsing markdown:', jasmine.any(Error));
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
      });

      it('should return empty safe HTML when parsing fails', () => {
        spyOn(console, 'error');

        // Spy on marked.parse to throw an error
        spyOn(marked, 'parse').and.throwError('Mock error');

        const result = service.render('Some markdown');

        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
      });
    });

    describe('complex markdown scenarios', () => {
      it('should handle markdown with embedded HTML correctly', () => {
        const markdown = `# Title

This is **bold** text with <em>embedded HTML</em>.

- List item with <strong>HTML</strong>
- Another item

\`\`\`html
<div class="example">Code block</div>
\`\`\``;

        service.render(markdown);

        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/<h1>Title<\/h1>/),
        );
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/<strong>bold<\/strong>/),
        );
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/<em>embedded HTML<\/em>/),
        );
      });

      it('should handle tables in markdown', () => {
        const markdown = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`;

        service.render(markdown);

        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/<table>/),
        );
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/<th>Header 1<\/th>/),
        );
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/<td>Cell 1<\/td>/),
        );
      });

      it('should handle blockquotes', () => {
        const markdown = '> This is a blockquote\n> with multiple lines';
        service.render(markdown);

        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/<blockquote>/),
        );
      });

      it('should handle horizontal rules', () => {
        const markdown = 'Text above\n\n---\n\nText below';
        service.render(markdown);

        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(/<hr>/),
        );
      });

      it('should handle images', () => {
        const markdown = '![Alt text](https://example.com/image.jpg "Title")';
        service.render(markdown);

        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          jasmine.stringMatching(
            /<img src="https:\/\/example\.com\/image\.jpg" alt="Alt text" title="Title">/,
          ),
        );
      });
    });
  });
});
