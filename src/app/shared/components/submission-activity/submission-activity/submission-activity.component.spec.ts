import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSubmissionActivityComponent } from './submission-activity.component';

describe('SubmissionActivityComponent', () => {
  let component: SharedSubmissionActivityComponent;
  let fixture: ComponentFixture<SharedSubmissionActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSubmissionActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSubmissionActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
