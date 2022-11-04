import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralRemarksComponent } from './general-remarks.component';

describe('GeneralRemarksComponent', () => {
  let component: GeneralRemarksComponent;
  let fixture: ComponentFixture<GeneralRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralRemarksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
