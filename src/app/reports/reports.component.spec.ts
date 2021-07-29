import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ReportsComponent } from './reports.component';
import { ReportsService } from './reports.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let mockReportsService: any;

  beforeEach(async () => {
    mockReportsService = jasmine.createSpyObj(['getReports'])
    mockReportsService.getReports.and.returnValue(of(["test Report"]));

    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      providers: [
        { provide: ReportsService, useValue: mockReportsService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
