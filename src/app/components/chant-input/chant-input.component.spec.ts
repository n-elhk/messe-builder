import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantInputComponent } from './chant-input.component';

describe('ChantInputComponent', () => {
  let component: ChantInputComponent;
  let fixture: ComponentFixture<ChantInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChantInputComponent]
    });
    fixture = TestBed.createComponent(ChantInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
