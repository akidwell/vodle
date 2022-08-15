import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from './error.service';
import { JobLoggerParameter } from '../../services/job-logger-service/job-logger-parameter';
import { JobLoggerService } from '../../services/job-logger-service/job-logger.service';
import { JobLoggerResponse } from '../../services/job-logger-service/job-logger-response';
import { UserAuth } from '../../authorization/user-auth';
import { MessageDialogService } from '../../services/message-dialog/message-dialog-service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  response!: JobLoggerResponse;

  constructor(private injector: Injector, private ngZone: NgZone) { }

  sub!: Subscription;

  async handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const jobLoggerService = this.injector.get(JobLoggerService);
    const messageDialogService = this.injector.get(MessageDialogService);

    let errorMessage: string;
    let formattedErrorMessage: string;
    let stackTrace;
    let parm: JobLoggerParameter = { source: '', message: '', data: '' };

    if (error instanceof HttpErrorResponse) {
      // Server Error
      errorMessage = errorService.getServerMessage(error);
      formattedErrorMessage = '<b>Message:</b>' + '<br>' + errorMessage;
      const serviceErrorMessage = error.error?.Message;
      if (serviceErrorMessage != null) {
        formattedErrorMessage += '<br>' + '<b>Details:</b>' + '<br>' + serviceErrorMessage;
      }
      //stackTrace = errorService.getServerStack(error);

      // only log Client http error responses
      if (error.status >= 400 && error.status < 500) {
        parm = { source: 'Angular - Server Side', message: errorMessage, data: await this.getXMLData(error) };
        this.sub = jobLoggerService.postJobLogger(parm).subscribe({
          next: jobLoggerResponse => {
            this.response = jobLoggerResponse;
          }
        });
      }
      console.error(errorMessage);

      this.ngZone.run(() => {
        messageDialogService.open('Service Error', formattedErrorMessage);
      });
    }
    else if (error.message?.includes('AuthApiError')) {
      console.error('Ignored AuthApiError: ' + error.message);
      // Do nothing for now
    } else {
      // Client Error
      errorMessage = errorService.getClientMessage(error);
      stackTrace = errorService.getClientStack(error);

      parm = { source: 'Angular', message: errorMessage, data: await this.getXMLData() };
      this.sub = jobLoggerService.postJobLogger(parm).subscribe({
        next: jobLoggerResponse => {
          this.response = jobLoggerResponse;
        }
      });
      console.error(errorMessage);
      this.ngZone.run(() => {
        messageDialogService.open('Client Error', errorMessage);
      });
    }
  }

  async getXMLData(errorResponse: HttpErrorResponse | null = null): Promise<string> {
    const userAuth = this.injector.get(UserAuth);
    const userName = userAuth.userName ?? '';
    const userId = userAuth.userId ?? '';
    const userRole = userAuth.userRole ?? '';

    let xml = '<ErrorData>';
    xml += '<UserId>' + userId + '</UserId>';
    xml += '<UserName>' + userName + '</UserName>';
    xml += '<Role>' + userRole + '</Role>';
    if (errorResponse != null) {
      xml += '<Code>' + errorResponse.status + '</Code>';
      xml += '<RequestUrl>' + errorResponse.url + '</RequestUrl>';
      xml += '<ErrorTitle>' + errorResponse.error?.title + '</ErrorTitle>';
      for (const property in errorResponse.error?.errors) {
        if (errorResponse.error.errors.hasOwnProperty(property)) {
          const propertyErrors: Array<string> = errorResponse.error.errors[property];
          xml += '<Messages>';
          propertyErrors.forEach(error =>
            xml += '  <Message>' + error + '</Message>'
          );
          xml += '</Messages>';
        }
      }
    }
    xml += '</ErrorData>';
    return xml;
  }

}