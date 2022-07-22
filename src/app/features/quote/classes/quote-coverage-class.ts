export class QuoteCoverageClass {
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages:string[] = [];

  get isDirty(): boolean {
    return this._isDirty;
  }
  get isValid(): boolean {
    return this._isValid;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  setIsDirtyFlag() {
    this._isDirty = !this.isDirty;
  }
  setIsValidFlag() {
    this._isValid = !this.isValid;
  }
  setCanBeSavedFlag() {
    this._canBeSaved = !this.canBeSaved;
  }
}
