export abstract class BuildingLocationClass {
  private _buildingNumber: number | null = null;
  private _premisesNumber: number | null = null;
  private _isAppliedToAll = false;

  get buildingNumber() : number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    this._buildingNumber = value;
  }

  get premisesNumber() : number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber= value;
  }

  get isAppliedToAll() : boolean {
    return this._isAppliedToAll;
  }
  set isAppliedToAll(value: boolean) {
    this._isAppliedToAll= value;
  }

  get building() : string | null {
    if (this._isAppliedToAll) {
      return 'All';
    }
    else if (this._premisesNumber == null || this._buildingNumber == null) {
      return null;
    }
    return this._premisesNumber.toString() + '-' + this._buildingNumber.toString();
  }

  set building(value: string | null) {
    if (value == 'All') {
      this._isAppliedToAll = true;
      this._premisesNumber = null;
      this._buildingNumber = null;
    } else {
      const parse = value?.split('-');
      if (parse?.length == 2) {
        const premises = parse[0] ?? '';
        const building = parse[1] ?? '';
        this._isAppliedToAll = false;
        this._premisesNumber = isNaN(Number(premises)) ? null : Number(premises) ;
        this._buildingNumber = isNaN(Number(building)) ? null : Number(building) ;
      }
      else {
        this._isAppliedToAll = false;
        this._premisesNumber = null;
        this._buildingNumber = null;
      }
    }
  }
}
