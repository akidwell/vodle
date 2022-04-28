import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredContactGroupComponent } from './insured-contact-group.component';

describe('InsuredContactGroupComponent', () => {
  let component: InsuredContactGroupComponent;
  let fixture: ComponentFixture<InsuredContactGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuredContactGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredContactGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
