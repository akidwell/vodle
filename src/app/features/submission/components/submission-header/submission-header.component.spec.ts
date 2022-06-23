import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionHeaderComponent } from './submission-header.component';

describe('SubmissionHeader.Component.TsComponent', () => {
  let component: SubmissionHeaderComponent;
  let fixture: ComponentFixture<SubmissionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionHeaderComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
