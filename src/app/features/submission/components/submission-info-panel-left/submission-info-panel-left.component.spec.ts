import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionInfoPanelLeftComponent } from './submission-info-panel-left.component';

describe('SubmissionInfoPanelLeftComponent', () => {
  let component: SubmissionInfoPanelLeftComponent;
  let fixture: ComponentFixture<SubmissionInfoPanelLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionInfoPanelLeftComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionInfoPanelLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
