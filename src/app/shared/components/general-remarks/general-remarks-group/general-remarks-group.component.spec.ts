import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralRemarksGroupComponent } from './general-remarks-group.component';

describe('GeneralRemarksGroupComponent', () => {
  let component: GeneralRemarksGroupComponent;
  let fixture: ComponentFixture<GeneralRemarksGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralRemarksGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralRemarksGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
