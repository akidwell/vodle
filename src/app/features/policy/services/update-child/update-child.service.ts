import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class UpdatePolicyChild {
  private endorsementCoverages = new Subject<void>();
  private collapseLocations = new Subject<void>();
  private expandLocations = new Subject<void>();
  private collapseEndorsementLocationsSubject = new Subject<void>();
  private collapseUnderlyingCoveragesSubject = new Subject<void>();
  private terrorismChange = new Subject<void>();

  endorsementCoveragesObservable$ = this.endorsementCoverages.asObservable();
  collapseLocationsObservable$ = this.collapseLocations.asObservable();
  expandLocationsObservable$ = this.expandLocations.asObservable();
  collapseEndorsementLocationsObservable$ = this.collapseEndorsementLocationsSubject.asObservable();
  collapseUnderlyingCoveragesObservable$ = this.collapseUnderlyingCoveragesSubject.asObservable();
  terrorismChange$ = this.terrorismChange.asObservable();

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
  public collapseUnderlyingCoverages() {
    this.collapseUnderlyingCoveragesSubject.next();
  }
  public terrorismChanged() {
    this.terrorismChange.next();
  }
}
