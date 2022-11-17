import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalNotesGroupComponent } from './internal-notes-group.component';

describe('InternalNotesGroupComponent', () => {
  let component: InternalNotesGroupComponent;
  let fixture: ComponentFixture<InternalNotesGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalNotesGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalNotesGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
