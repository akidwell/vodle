import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ImportPolicy } from './interfaces/import-policy';

import { ImportComponent } from './import.component';
import { ImportService } from './import.service';
import { DecimalPipe } from '@angular/common';
import { RemoveCommaPipe } from './remove-comma.pipe';


describe('ImportComponent', () => {
  let component: ImportComponent;
  let fixture: ComponentFixture<ImportComponent>;
  let mockImportService: any;
  let importPolicies: ImportPolicy[];
  let router: Router;

  beforeEach(async () => {
    mockImportService = jasmine.createSpyObj(['getImportPolicies'])

    importPolicies = [
      { submissionNumber: 1, quoteNumber: 1, quoteId: 1, policyNumber: '123', policyEffectiveDate: '01/01/2021', insuredCode: 1, insuredName: 'test', producerName: 'test', uwLastName: 'test', branchName: 'test', submissionEventCode: 'N', pacCode: 'A', programId: 1, programName: 'Test' }
    ]

    mockImportService.getImportPolicies.and.returnValue(of(importPolicies));

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ImportComponent,RemoveCommaPipe],
      providers: [
        { provide: ImportService, useValue: mockImportService },{provide: Router, useValue: router}, DecimalPipe
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should have 1 import policies', () => {
    expect(component.importPolicies.length).toBe(1);
  });

  // it('Should have 1 filtered import policies', () => {
  //   expect(component.performFilter('1').length).toBe(1);
  // });

  // it('Should have 0 filtered import policies', () => {
  //   expect(component.performFilter('9').length).toBe(0);
  // });

});
