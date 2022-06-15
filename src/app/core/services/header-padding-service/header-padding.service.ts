import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LayoutEnum } from '../../enums/layout-enum';

@Injectable()
export class HeaderPaddingService {
  private _headerPadding = LayoutEnum.header_height;
  private _buttonBarPadding = 0;
  private _sidebarPadding = 0;
  private _sidebarWidthAndHeight = 0;
  private _sidebarExpanded = false;
  private _userFieldWidth = 0;

  headerPadding$: BehaviorSubject<number> = new BehaviorSubject(this._headerPadding);
  buttonBarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._buttonBarPadding);
  totalPadding$: BehaviorSubject<number> = new BehaviorSubject(this._buttonBarPadding + this._headerPadding);

  sidebarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._sidebarPadding);
  sidebarWidthAndHeight$: BehaviorSubject<number> = new BehaviorSubject(this._sidebarWidthAndHeight);
  sidebarExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(this._sidebarExpanded);
  userFieldWidth$: BehaviorSubject<number> = new BehaviorSubject(this._userFieldWidth);

  get headerPadding(): number {
    return this._headerPadding;
  }

  set headerPadding(val: number) {
    this._headerPadding = val;
    this.headerPadding$.next(this._headerPadding);
    this.totalPadding$.next(this._buttonBarPadding + this._headerPadding);
  }
  get buttonBarPadding(): number {
    return this._buttonBarPadding;
  }

  set buttonBarPadding(val: number) {
    this._buttonBarPadding += val;
    this.buttonBarPadding$.next(this._buttonBarPadding);
    this.totalPadding$.next(this._buttonBarPadding + this._headerPadding);
  }
  get sidebarPadding(): number {
    return this._sidebarPadding;
  }

  set sidebarPadding(val: number) {
    this._sidebarPadding = val;
    this.sidebarPadding$.next(this._sidebarPadding);
  }
  get sidebarWidthAndHeight(): number {
    return this._sidebarWidthAndHeight;
  }

  set sidebarWidthAndHeight(val: number) {
    this._sidebarWidthAndHeight = val;
    this.sidebarWidthAndHeight$.next(this._sidebarWidthAndHeight);
    if (val > 0){
      this._sidebarExpanded = true;
    } else {
      this._sidebarExpanded = false;
    }
    this.sidebarExpanded$.next(this._sidebarExpanded);
  }
  get userFieldWidth(): number {
    return this._userFieldWidth;
  }

  set userFieldWidth(val: number) {
    this._userFieldWidth = val;
    this.userFieldWidth$.next(this._userFieldWidth);
  }

  incrementHeaderPadding(val: number) {
    this.headerPadding += val;
  }
  incrementButtonBarPadding(val: number){
    this.buttonBarPadding += val;
  }
  resetPadding(){
    this._headerPadding = LayoutEnum.header_height;
    this._buttonBarPadding = 0;
    this.headerPadding$.next(this._headerPadding);
    this.buttonBarPadding$.next(this._buttonBarPadding);
    this.totalPadding$.next(this._buttonBarPadding + this._headerPadding);
  }
  resetSidebarPadding(){
    this._sidebarPadding = 0;
    this.sidebarPadding$.next(this._sidebarPadding);
  }

}
