import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderlyingCoveragesComponent } from './underlying-coverages.component';

describe('UnderlyingCoveragesComponent', () => {
  let component: UnderlyingCoveragesComponent;
  let fixture: ComponentFixture<UnderlyingCoveragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderlyingCoveragesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderlyingCoveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
