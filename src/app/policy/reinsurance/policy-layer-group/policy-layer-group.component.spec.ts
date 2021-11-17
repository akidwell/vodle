import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyLayerGroupComponent } from './policy-layer-group.component';

describe('PolicyLayerGroupComponent', () => {
  let component: PolicyLayerGroupComponent;
  let fixture: ComponentFixture<PolicyLayerGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyLayerGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyLayerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
