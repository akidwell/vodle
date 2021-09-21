import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementCoveragesComponent } from './endorsement-coverages.component';

describe('EndorsementCoveragesComponent', () => {
  let component: EndorsementCoveragesComponent;
  let fixture: ComponentFixture<EndorsementCoveragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementCoveragesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementCoveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
