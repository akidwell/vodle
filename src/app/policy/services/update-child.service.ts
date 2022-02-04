import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable()
export class UpdatePolicyChild {
  private endorsementCoverages = new Subject<any>();
  private collapseLocations = new Subject<any>();
  private expandLocations = new Subject<any>();
  private collapseEndorsementLocationsSubject = new Subject<any>();
  private terrorismChange = new Subject<any>();

  endorsementCoveragesObservable$ = this.endorsementCoverages.asObservable();
  collapseLocationsObservable$ = this.collapseLocations.asObservable();
  expandLocationsObservable$ = this.expandLocations.asObservable();
  collapseEndorsementLocationsObservable$ = this.collapseEndorsementLocationsSubject.asObservable();
  terrorismChange$ = this.terrorismChange.asObservable();

  constructor(){}

  public notifyEndorsementCoverages() {
    this.endorsementCoverages.next();
  }
  public collapseLocationsCoverages() {
    this.collapseLocations.next();
  }
  public expandLocationsCoverages() {
    this.expandLocations.next();
  }
  public collapseEndorsementLocations() {
    this.collapseEndorsementLocationsSubject.next();
  }
  public terrorismChanged() {
    this.terrorismChange.next();
  }
}
