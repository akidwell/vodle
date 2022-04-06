import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAdditionalNamedInsuredsComponent } from './additional-named-insureds.component';

describe('SharedAdditionalNamedInsuredsComponent', () => {
  let component: SharedAdditionalNamedInsuredsComponent;
  let fixture: ComponentFixture<SharedAdditionalNamedInsuredsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedAdditionalNamedInsuredsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAdditionalNamedInsuredsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
