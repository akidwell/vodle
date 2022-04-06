import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementLocationComponent } from './endorsement-location.component';

describe('EndorsementLocationComponent', () => {
  let component: EndorsementLocationComponent;
  let fixture: ComponentFixture<EndorsementLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
