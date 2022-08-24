import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Code } from 'src/app/core/models/code';

@Injectable()
export class PropertyDataService {
  buildingList$: BehaviorSubject<Code[]> = new BehaviorSubject(this.buildingList);
  private _buildingList: Code[] = [];

  get buildingList(): Code[] { return this._buildingList; }
  set buildingList(value: Code[]) {
    if (JSON.stringify(this._buildingList) != JSON.stringify(value)) {
      this._buildingList = value;
      this.buildingList$.next(this._buildingList);
    }
  }
}