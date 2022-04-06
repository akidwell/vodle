import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountInformationComponent } from './account-information.component';
import { FormsModule } from '@angular/forms';

describe('AccountInformationComponent', () => {
  let component: AccountInformationComponent;
  let fixture: ComponentFixture<AccountInformationComponent>;
  let mockActivatedRoute: any;
  
  beforeEach(async () => {
    mockActivatedRoute = jasmine.createSpyObj(['parent'])
    mockActivatedRoute.parent.and.returnValue( of({ policyId: 0, policySymbol: "", fullPolicyNumber: "" }));

    await TestBed.configureTestingModule({
      imports: [FormsModule,NgbModule],
      declarations: [ AccountInformationComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
