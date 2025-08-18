import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Spotlight } from './spotlight';

@Component({
  template: '<div appSpotlight></div>',
  standalone: true,
  imports: [Spotlight],
})
class TestComponent {}

describe('Spotlight', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  });

  it('should create directive instance', () => {
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should update CSS custom properties on pointer move', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const divElement = fixture.nativeElement.querySelector('div');

    const mockEvent = new PointerEvent('pointermove', {
      clientX: 100,
      clientY: 150,
    });

    // Mock getBoundingClientRect
    spyOn(divElement, 'getBoundingClientRect').and.returnValue({
      left: 10,
      top: 20,
      width: 200,
      height: 300,
      right: 210,
      bottom: 320,
      x: 10,
      y: 20,
      toJSON() {
        return {};
      },
    });

    divElement.dispatchEvent(mockEvent);

    expect(divElement.style.getPropertyValue('--mx')).toBe('90px');
    expect(divElement.style.getPropertyValue('--my')).toBe('130px');
  });
});
