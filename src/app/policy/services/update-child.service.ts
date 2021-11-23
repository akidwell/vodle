import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable()
export class UpdatePolicyChild {
  private endorsementCoverages = new Subject<any>();
  private collapseLocations = new Subject<any>();
  private expandLocations = new Subject<any>();
  private collapseEndorsementLocationsSubject = new Subject<any>();


  endorsementCoveragesObservable$ = this.endorsementCoverages.asObservable();
  collapseLocationsObservable$ = this.collapseLocations.asObservable();
  expandLocationsObservable$ = this.expandLocations.asObservable();
  collapseEndorsementLocationsObservable$ = this.collapseEndorsementLocationsSubject.asObservable();

  // GAM - Research will probably delete
  // private _isCoveragesValid = new BehaviorSubject<boolean>(true);
  // isCoveragesValid$ = this._isCoveragesValid.asObservable();
  // get isCoveragesValid(): boolean { return this._isCoveragesValid.getValue(); }
  // set isCoveragesValid(value: boolean) { this._isCoveragesValid.next(value); }

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


}
