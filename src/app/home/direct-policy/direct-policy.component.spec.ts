import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPolicyComponent } from './direct-policy.component';

describe('DirectPolicyComponent', () => {
  let component: DirectPolicyComponent;
  let fixture: ComponentFixture<DirectPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
