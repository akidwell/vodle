import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyLayerComponent } from './policy-layer-group.component';

describe('PolicyLayerGroupComponent', () => {
  let component: PolicyLayerComponent;
  let fixture: ComponentFixture<PolicyLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyLayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
