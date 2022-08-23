import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionInfoBaseComponent } from './submission-info-base.component';

describe('SubmissionInfoBaseComponent', () => {
  let component: SubmissionInfoBaseComponent;
  let fixture: ComponentFixture<SubmissionInfoBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionInfoBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionInfoBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
