import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementLocationGroupComponent } from './endorsement-location-group.component';

describe('EndorsementLocationGroupComponent', () => {
  let component: EndorsementLocationGroupComponent;
  let fixture: ComponentFixture<EndorsementLocationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementLocationGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementLocationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
