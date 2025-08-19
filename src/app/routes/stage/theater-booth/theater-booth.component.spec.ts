import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TheaterBoothComponent } from './theater-booth.component';

describe('TheaterBoothComponent', () => {
  let component: TheaterBoothComponent;
  let fixture: ComponentFixture<TheaterBoothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheaterBoothComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TheaterBoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSpotlight event', () => {
    spyOn(component.toggleSpotlight, 'emit');
    component.onToggleSpotlight();
    expect(component.toggleSpotlight.emit).toHaveBeenCalled();
  });

  it('should emit toggleCurtains event', () => {
    spyOn(component.toggleCurtains, 'emit');
    component.onToggleCurtains();
    expect(component.toggleCurtains.emit).toHaveBeenCalled();
  });

  it('should emit toggleMusic event', () => {
    spyOn(component.toggleMusic, 'emit');
    component.onToggleMusic();
    expect(component.toggleMusic.emit).toHaveBeenCalled();
  });

  it('should emit triggerApplause event', () => {
    spyOn(component.triggerApplause, 'emit');
    component.onTriggerApplause();
    expect(component.triggerApplause.emit).toHaveBeenCalled();
  });

  it('should emit resetCharacter event', () => {
    spyOn(component.resetCharacter, 'emit');
    component.onResetCharacter();
    expect(component.resetCharacter.emit).toHaveBeenCalled();
  });

  it('should display character information correctly', () => {
    const testCharacter = 'Test Character';
    const testRole = 'Test Role';
    const testContext = 'Test Context';
    const testTraits = ['Brave', 'Wise'];
    const testNotes = 'Test Notes';

    fixture.componentRef.setInput('currentCharacter', testCharacter);
    fixture.componentRef.setInput('characterRole', testRole);
    fixture.componentRef.setInput('sceneContext', testContext);
    fixture.componentRef.setInput('characterTraits', testTraits);
    fixture.componentRef.setInput('performanceNotes', testNotes);
    fixture.detectChanges();

    expect(component.currentCharacter()).toBe(testCharacter);
    expect(component.characterRole()).toBe(testRole);
    expect(component.sceneContext()).toBe(testContext);
    expect(component.characterTraits()).toEqual(testTraits);
    expect(component.performanceNotes()).toBe(testNotes);
  });
});
