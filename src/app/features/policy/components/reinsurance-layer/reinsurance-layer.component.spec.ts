import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsuranceLayerComponent } from './reinsurance-layer.component';

describe('ReinsuranceLayerComponent', () => {
  let component: ReinsuranceLayerComponent;
  let fixture: ComponentFixture<ReinsuranceLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReinsuranceLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinsuranceLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
