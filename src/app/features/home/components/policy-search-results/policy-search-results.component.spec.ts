import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySearchResultsComponent } from './policy-search-results.component';

describe('PolicySearchResultsComponent', () => {
  let component: PolicySearchResultsComponent;
  let fixture: ComponentFixture<PolicySearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicySearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
