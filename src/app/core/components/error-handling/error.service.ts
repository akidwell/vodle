import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  
  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
        return 'No Internet Connection';
    }
    return error.message ? error.message : error.toString();
}

getClientStack(error: Error): any {
    return error.stack;
}

getServerMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 400: {
            return `Bad Request: ${error.message}`;
        }
        case 401: {
            return `Unauthorized: ${error.message}`;
        }
        case 404: {
            return `Not Found: ${error.message}`;
        }
        case 403: {
            return `Access Denied: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
        default: {
            return `Unknown Server Error: ${error.message}`;
        }
    }
}

getServerStack(error: HttpErrorResponse): string {
    // handle stack trace
    return 'stack';
}
}