import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalNamedInsuredsGroupComponent } from './additional-named-insureds-group.component';

describe('AdditionalNamedInsuredsGroupComponent', () => {
  let component: AdditionalNamedInsuredsGroupComponent;
  let fixture: ComponentFixture<AdditionalNamedInsuredsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalNamedInsuredsGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalNamedInsuredsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
