import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceGroupComponent } from './invoice-group.component';

describe('InvoiceGroupComponent', () => {
  let component: InvoiceGroupComponent;
  let fixture: ComponentFixture<InvoiceGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
