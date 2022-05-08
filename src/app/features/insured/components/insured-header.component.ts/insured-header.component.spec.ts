import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredHeaderComponent } from './insured-header.component';

describe('InsuredHeader.Component.TsComponent', () => {
  let component: InsuredHeaderComponent;
  let fixture: ComponentFixture<InsuredHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
