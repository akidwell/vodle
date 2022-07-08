import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionMarkComponent } from './submission-status.component';

describe('SubmissionMarkComponent', () => {
  let component: SubmissionMarkComponent;
  let fixture: ComponentFixture<SubmissionMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionMarkComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
