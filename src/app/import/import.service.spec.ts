import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../config/config.service';
import { ImportService } from './import.service';

describe('ImportService', () => {
  let service: ImportService;
  let mockConfigService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    mockConfigService = jasmine.createSpyObj(['apiBaseUrl'])
    mockConfigService.apiBaseUrl.and.returnValue('');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImportService,
        { provide: ConfigService, useValue: mockConfigService }
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO - This is breaking still
  // it('should call with correct URL', () => {
  //   service.getImportPolicies().subscribe();
  //   const req = httpTestingController.expectOne('api/import-policies');
  //   req.flush({submissionNumber: 1}); 
  // });

});
