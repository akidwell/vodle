import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionInfoPanelRightComponent } from './submission-info-panel-right.component';

describe('SubmissionInfoPanelRightComponent', () => {
  let component: SubmissionInfoPanelRightComponent;
  let fixture: ComponentFixture<SubmissionInfoPanelRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionInfoPanelRightComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionInfoPanelRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
