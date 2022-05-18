import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserAuth {
  userId = '';
  userName = '';
  bearerToken = '';
  isAuthenticated = false;

  private _isApiAuthenticated = new BehaviorSubject<boolean>(false);
  isApiAuthenticated$ = this._isApiAuthenticated.asObservable();
  get isApiAuthenticated(): boolean { return this._isApiAuthenticated.getValue(); }
  set isApiAuthenticated(value: boolean) { this._isApiAuthenticated.next(value); }

  private _apiBearerToken = new BehaviorSubject<string>('');
  ApiBearerToken$ = this._apiBearerToken.asObservable();
  get ApiBearerToken(): string { return this._apiBearerToken.getValue(); }
  set ApiBearerToken(value: string) { this._apiBearerToken.next(value); }

  private _canExecuteImport = new BehaviorSubject<boolean>(false);
  canExecuteImport$ = this._canExecuteImport.asObservable();
  get canExecuteImport(): boolean { return this._canExecuteImport.getValue(); }
  set canExecuteImport(value: boolean) { this._canExecuteImport.next(value); }

  private _canEditPolicy = new BehaviorSubject<boolean>(false);
  canEditPolicy$ = this._canEditPolicy.asObservable();
  get canEditPolicy(): boolean { return this._canEditPolicy.getValue(); }
  set canEditPolicy(value: boolean) { this._canEditPolicy.next(value); }

  private _canEditInsured = new BehaviorSubject<boolean>(false);
  canEditInsured$ = this._canEditInsured.asObservable();
  get canEditInsured(): boolean { return this._canEditInsured.getValue(); }
  set canEditInsured(value: boolean) { this._canEditInsured.next(value); }

  private _canEditSubmission = new BehaviorSubject<boolean>(false);
  canEditSubmission$ = this._canEditSubmission.asObservable();
  get canEditSubmission(): boolean { return this._canEditSubmission.getValue(); }
  set canEditSubmission(value: boolean) { this._canEditSubmission.next(value); }

  private _userRole = new BehaviorSubject<string>('');
  userRole$ = this._userRole.asObservable();
  get userRole(): string { return this._userRole.getValue(); }
  set userRole(value: string) { this._userRole.next(value); }

  private _environment = new BehaviorSubject<string>('');
  environment$ = this._environment.asObservable();
  get environment(): string { return this._environment.getValue(); }
  set environment(value: string) { this._environment.next(value); }

  private _loaded$ = new BehaviorSubject<boolean>(false);
  get loaded$() { return this._loaded$.asObservable(); }
  loaded() {
    this._loaded$.next(true);
  }


  init(): void {
    this.userName = '';
    this.bearerToken = '';
  }

}
