import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredSubmissionActivityComponent } from './insured-submission-activity.component';

describe('InsuredSubmissionActivityComponent', () => {
  let component: InsuredSubmissionActivityComponent;
  let fixture: ComponentFixture<InsuredSubmissionActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredSubmissionActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredSubmissionActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
