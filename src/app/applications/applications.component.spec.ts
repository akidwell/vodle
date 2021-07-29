import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApplicationsService } from './applications.service';
import { ApplicationsComponent } from './applications.component';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;
  let mockApplicationsService: any;

  beforeEach(async () => {
    mockApplicationsService = jasmine.createSpyObj(['getApplications'])
    mockApplicationsService.getApplications.and.returnValue(of(["test"]));

    await TestBed.configureTestingModule({
      declarations: [ApplicationsComponent],
      providers: [
        { provide: ApplicationsService, useValue: mockApplicationsService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
