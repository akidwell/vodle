import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInterestGroupComponent } from './additional-interest-group.component';

describe('AdditionalInterestGroupComponent', () => {
  let component: AdditionalInterestGroupComponent;
  let fixture: ComponentFixture<AdditionalInterestGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalInterestGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInterestGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
