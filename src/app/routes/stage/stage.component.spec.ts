import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { StageComponent } from './stage.component';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { ConfigService } from '../../core/services/config.service';
import { v4 as uuidv4 } from 'uuid';

describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      paramMap: of(new Map([['sceneId', 'test-scene']])),
    });
    const markdownServiceSpy = jasmine.createSpyObj('MarkdownService', ['render']);
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['provider', 'model', 'system']);

    // Setup return values for config service signals
    configServiceSpy.provider.and.returnValue('openai');
    configServiceSpy.model.and.returnValue('gpt-3.5-turbo');
    configServiceSpy.system.and.returnValue('');

    await TestBed.configureTestingModule({
      imports: [StageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: MarkdownService, useValue: markdownServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with demo character data', () => {
    component.ngOnInit();
    expect(component.currentCharacter()).toBe('Lady Evangeline');
    expect(component.characterRole()).toBe('Victorian Medium');
    expect(component.characterTraits()).toEqual(['Mysterious', 'Wise', 'Elegant', 'Mystical']);
  });

  it('should handle theater booth events', () => {
    component.toggleSpotlight();
    expect(component.performanceNotes()).toContain('Spotlight activated');

    component.toggleCurtains();
    expect(component.performanceNotes()).toContain('Curtains drawn');

    component.toggleMusic();
    expect(component.performanceNotes()).toContain('music playing');

    component.triggerApplause();
    expect(component.performanceNotes()).toContain('applauds');
  });

  it('should reset character information', () => {
    component.currentCharacter.set('Test Character');
    component.characterRole.set('Test Role');

    component.resetCharacter();

    expect(component.currentCharacter()).toBe('');
    expect(component.characterRole()).toBe('');
    expect(component.sceneContext()).toBe('');
    expect(component.characterTraits()).toEqual([]);
    expect(component.performanceNotes()).toBe('');
  });

  it('should handle enter key correctly', () => {
    spyOn(component, 'send');
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onEnterKey(enterEvent);
    expect(component.send).toHaveBeenCalled();
  });

  it('should not send on shift+enter', () => {
    spyOn(component, 'send');
    const shiftEnterEvent = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.onEnterKey(shiftEnterEvent);
    expect(component.send).not.toHaveBeenCalled();
  });

  it('should analyze character from messages', () => {
    const systemMessage = {
      tkid: uuidv4(),
      role: 'system' as const,
      content: 'You are Gandalf the wizard, wise and powerful.',
    };
    const assistantMessage = {
      tkid: uuidv4(),
      role: 'assistant' as const,
      content:
        'I am wise and ancient, with vast knowledge and wisdom. My mysterious powers and mysterious knowledge guide me.',
    };

    component.messages.set([systemMessage, assistantMessage]);

    // The analyzeCharacterFromMessages is called in the effect
    fixture.detectChanges();

    expect(component.currentCharacter()).toBe('Gandalf the wizard');
    expect(component.characterTraits()).toContain('Wise');
    expect(component.characterTraits()).toContain('Mysterious');
  });
});
