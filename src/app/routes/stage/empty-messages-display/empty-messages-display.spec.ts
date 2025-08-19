import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyMessagesDisplay } from './empty-messages-display';

describe('EmptyMessagesDisplay', () => {
  let component: EmptyMessagesDisplay;
  let fixture: ComponentFixture<EmptyMessagesDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyMessagesDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyMessagesDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
