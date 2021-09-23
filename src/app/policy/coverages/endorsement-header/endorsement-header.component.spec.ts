import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndorsementHeaderComponent } from './endorsement-header.component';

describe('EndorsementHeaderComponent', () => {
  let component: EndorsementHeaderComponent;
  let fixture: ComponentFixture<EndorsementHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndorsementHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
