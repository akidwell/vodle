import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectivitiesComponent } from './subjectivities.component';

describe('SubjectivitiesComponent', () => {
  let component: SubjectivitiesComponent;
  let fixture: ComponentFixture<SubjectivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
