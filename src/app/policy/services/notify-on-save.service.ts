import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class NotifyOnSave {
  private notify = new Subject<any>();

  notifyObservable$ = this.notify.asObservable();

  constructor(){}

  public notifyChild() {
    this.notify.next();
  }
}
