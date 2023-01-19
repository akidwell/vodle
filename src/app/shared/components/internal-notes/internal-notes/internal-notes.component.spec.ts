import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalNotesComponent } from './internal-notes.component';

describe('InternalNotesComponent', () => {
  let component: InternalNotesComponent;
  let fixture: ComponentFixture<InternalNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
