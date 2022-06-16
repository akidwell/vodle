import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LayoutEnum } from '../../enums/layout-enum';

@Injectable()
export class HeaderPaddingService{
  private _headerPadding = LayoutEnum.header_height;
  private _totalHeaderHeight = LayoutEnum.header_height;
  private _buttonBarPadding = LayoutEnum.nav_routing_height;
  private _buttonBarHeight = LayoutEnum.button_bar_height;
  private _sidebarPadding = 210;
  private _sidebarWidthAndHeight = 100;
  private _sidebarExpanded = true;
  private _userFieldWidth = 0;
  private _navRoutingHeight = LayoutEnum.nav_routing_height;
  private _totalPageWidth!: number;
  private _totalHeaderWidth = 0;
  private _totalBodyWidth = 0;

  headerPadding$: BehaviorSubject<number> = new BehaviorSubject(this._headerPadding);
  buttonBarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._buttonBarPadding);
  buttonBarHeight$: BehaviorSubject<number> = new BehaviorSubject(this._buttonBarHeight);

  totalPadding$: BehaviorSubject<number> = new BehaviorSubject(this._buttonBarHeight + this._headerPadding);

  sidebarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._sidebarPadding);
  sidebarWidthAndHeight$: BehaviorSubject<number> = new BehaviorSubject(this._sidebarWidthAndHeight);
  sidebarExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(this._sidebarExpanded);
  userFieldWidth$: BehaviorSubject<number> = new BehaviorSubject(this._userFieldWidth);
  navRoutingHeight$: BehaviorSubject<number> = new BehaviorSubject(this._navRoutingHeight);
  totalPageWidth$: BehaviorSubject<number> = new BehaviorSubject(this._totalPageWidth);
  totalHeaderWidth$: BehaviorSubject<number> = new BehaviorSubject(this._totalHeaderWidth);
  totalBodyWidth$: BehaviorSubject<number> = new BehaviorSubject(this._totalBodyWidth);
  totalHeaderHeight$: BehaviorSubject<number> = new BehaviorSubject(this._totalHeaderHeight);

  constructor() {
    this.onResizeOrLoad();
  }
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
    this._buttonBarPadding = val;
    this.buttonBarPadding$.next(this._buttonBarPadding);
    this.totalPadding$.next(this._buttonBarPadding + this._headerPadding);
  }
  get buttonBarHeight(): number {
    return this._buttonBarHeight;
  }

  set buttonBarHeight(val: number) {
    this._buttonBarHeight = val;
    this.buttonBarHeight$.next(this._buttonBarHeight);
  }
  get sidebarPadding(): number {
    return this._sidebarPadding;
  }

  set sidebarPadding(val: number) {
    this._sidebarPadding = val;
    this.sidebarPadding$.next(this._sidebarPadding);

    this.updateInnerWidth();
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
  get navRoutingHeight(): number {
    return this._navRoutingHeight;
  }

  set navRoutingHeight(val: number) {
    this._navRoutingHeight = val;
    this.navRoutingHeight$.next(this._navRoutingHeight);
  }
  get totalHeaderHeight(): number {
    return this._totalHeaderHeight;
  }

  set totalHeaderHeight(val: number) {
    this._totalHeaderHeight = val;
    this.totalHeaderHeight$.next(this._totalHeaderHeight);
  }
  get totalPageWidth(): number {
    return this._navRoutingHeight;
  }

  set totalPageWidth(val: number) {
    this._totalPageWidth = val;
    this.totalPageWidth$.next(this._totalPageWidth);
    this.updateInnerWidth();
  }

  resetPadding(){
    this._headerPadding = LayoutEnum.header_height;
    this.headerPadding$.next(this._headerPadding);
    this.buttonBarPadding$.next(this._buttonBarPadding);
    this.totalPadding$.next(this._buttonBarPadding + this._headerPadding);
  }
  resetSidebarPadding(){
    this._sidebarPadding = 0;
    this.sidebarPadding$.next(this._sidebarPadding);
  }
  onResizeOrLoad() {
    this.totalPageWidth = window.innerWidth - LayoutEnum.scroll_bar_width;
  }
  updateInnerWidth(){
    this._totalHeaderWidth = this._totalPageWidth - this._userFieldWidth - this._sidebarPadding - LayoutEnum.sidebar_min_width;
    this._totalBodyWidth = this._totalPageWidth - this._sidebarPadding;
    setTimeout(() => this.totalHeaderWidth$.next(this._totalHeaderWidth),0);
    setTimeout(() => this.totalBodyWidth$.next(this._totalBodyWidth),0);
  }

}
