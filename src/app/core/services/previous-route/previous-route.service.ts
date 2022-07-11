import { Injectable } from '@angular/core';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {

  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  public getPreviousUrlFormatted() {
    if (this.previousUrl.value != '') {
      const path = this.previousUrl.value.split('/');
      if (path.length > 1 && path[1][0] !== undefined) {
        return 'Previous - ' + path[1][0].toUpperCase() + path[1].slice(1) + (path[2] !== undefined ? ' #' + path[2] : '');
      }
    }
    return '';
  }
}
