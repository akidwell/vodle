import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectPolicyServiceService {

  private collapseEndorsementLocationsSubject = new Subject<any>();

  collapseEndorsementLocationsObservable$ = this.collapseEndorsementLocationsSubject.asObservable();

  constructor(){}

  public collapseEndorsementLocations() {
    this.collapseEndorsementLocationsSubject.next();
  }
}
