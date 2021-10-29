import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class UpdatePolicyChild {
  private endorsementCoverages = new Subject<any>();
  private collapseLocations = new Subject<any>();
  private expandLocations = new Subject<any>();

  endorsementCoveragesObservable$ = this.endorsementCoverages.asObservable();
  collapseLocationsObservable$ = this.collapseLocations.asObservable();
  expandLocationsObservable$ = this.expandLocations.asObservable();

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
}
