
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    
  constructor(private injector: Injector) { }

    handleError(error: Error | HttpErrorResponse): Observable<never> {
        const errorService = this.injector.get(ErrorService)
        // const logger = this.injector.get(LoggingService);
        // const notifier = this.injector.get(NotificationService);

        let message;
        let stackTrace;

        if (error instanceof HttpErrorResponse) {
            // Server Error
            message = errorService.getServerMessage(error);
            stackTrace = errorService.getServerStack(error);
            console.log(error.message);
        } else {
            // Client Error
            message = errorService.getClientMessage(error);
            stackTrace = errorService.getClientStack(error);
            console.log(error.message);
        }
     return throwError(message);

       // logger.logError(message, stackTrace);
    }
}