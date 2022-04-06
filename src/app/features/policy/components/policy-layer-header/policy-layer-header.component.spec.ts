import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyLayerHeaderComponent } from './policy-layer-header.component';

describe('PolicyLayerHeaderComponent', () => {
  let component: PolicyLayerHeaderComponent;
  let fixture: ComponentFixture<PolicyLayerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyLayerHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyLayerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
