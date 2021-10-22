import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalNamedInsuredsComponent } from './additional-named-insureds.component';

describe('AdditionalNamedInsuredsComponent', () => {
  let component: AdditionalNamedInsuredsComponent;
  let fixture: ComponentFixture<AdditionalNamedInsuredsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalNamedInsuredsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalNamedInsuredsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
