import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StageInputComponent } from './stage-input.component';

describe('StageInputComponent', () => {
  let component: StageInputComponent;
  let fixture: ComponentFixture<StageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageInputComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit send event when onSend is called', () => {
    spyOn(component.send, 'emit');
    component.onSend();
    expect(component.send.emit).toHaveBeenCalled();
  });

  it('should emit enterKey event when onEnterKey is called', () => {
    const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(component.enterKey, 'emit');
    component.onEnterKey(mockEvent);
    expect(component.enterKey.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should bind inputValue correctly', () => {
    const testValue = 'test input value';
    fixture.componentRef.setInput('inputValue', testValue);
    fixture.detectChanges();
    expect(component.inputValue()).toBe(testValue);
  });

  it('should bind systemValue correctly', () => {
    const testValue = 'test system value';
    fixture.componentRef.setInput('systemValue', testValue);
    fixture.detectChanges();
    expect(component.systemValue()).toBe(testValue);
  });

  it('should bind busy state correctly', () => {
    fixture.componentRef.setInput('busy', true);
    fixture.detectChanges();
    expect(component.busy()).toBe(true);
  });
});
