import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from './error.service';
import { JobLoggerParameter } from './job-logger-parameter';
import { JobLoggerService } from './job-logger.service';
import { JobLoggerResponse} from './job-logger-response';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  response!: JobLoggerResponse;
    
  constructor(private  injector: Injector) { }

  sub!: Subscription;

    handleError(error: Error | HttpErrorResponse) {
        const errorService = this.injector.get(ErrorService)
        const jobLoggerService = this.injector.get(JobLoggerService)

        let errorMessage;
        let stackTrace;
        let parm: JobLoggerParameter = {source: "", message: "", data: "" };

        if (error instanceof HttpErrorResponse) {
            // Server Error
            errorMessage = errorService.getServerMessage(error);
            stackTrace = errorService.getServerStack(error);
            parm = { source: stackTrace, message: errorMessage, data: "" };
            this.sub = jobLoggerService.postJobLogger(parm).subscribe({
              next: jobLoggerResponse => {
                this.response = jobLoggerResponse;}
              })
            console.log(errorMessage);
            window.alert(errorMessage);
          } else {
            // Client Error
            errorMessage = errorService.getClientMessage(error);
            stackTrace = errorService.getClientStack(error);
            parm = {source: "Angular", message: errorMessage, data: "" };
            this.sub = jobLoggerService.postJobLogger(parm).subscribe({
              next: jobLoggerResponse => {
                this.response = jobLoggerResponse;}
              })
            console.log(errorMessage);
            window.alert(errorMessage)      
            }
    }
}