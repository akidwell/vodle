import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorHandler, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './global-error-handler';
import { ServerErrorInterceptor } from '../../interceptors/server-error-interceptor';

//this test is a work in progess. 

describe('GlobalErrorHandler', () => {
  let geh: GlobalErrorHandler;
  let httpTestingController: HttpTestingController;
  let injector: Injector;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ 
        { provide: ErrorHandler, useClass: GlobalErrorHandler},
        { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    injector = TestBed.inject(Injector);
    geh = TestBed.inject(GlobalErrorHandler);
  });

  it('should create an instance', () => {
    expect(geh).toBeTruthy();
  });
});

