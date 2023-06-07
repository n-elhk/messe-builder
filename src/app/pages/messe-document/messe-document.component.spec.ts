import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesseDocumentComponent } from './messe-document.component';

describe('MesseDocumentComponent', () => {
  let component: MesseDocumentComponent;
  let fixture: ComponentFixture<MesseDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MesseDocumentComponent]
    });
    fixture = TestBed.createComponent(MesseDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
