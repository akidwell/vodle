import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationConfirmationComponent } from './navigation-confirmation.component';

describe('NavigationConfirmationComponent', () => {
  let component: NavigationConfirmationComponent;
  let fixture: ComponentFixture<NavigationConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
