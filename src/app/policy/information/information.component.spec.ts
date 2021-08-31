import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InformationComponent } from './information.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';

describe('InformationComponent', () => {
  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockActivatedRoute = jasmine.createSpyObj(['parent'])
    mockActivatedRoute.parent.and.returnValue( of({ policyId: 0, policySymbol: "", fullPolicyNumber: "" }));

    await TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule],
      declarations: [ InformationComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
