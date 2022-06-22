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
  private _sidebarExpanderWidth = 50;
  private _sidebarExpanded = true;
  private _userFieldWidth = 0;
  private _navRoutingHeight = LayoutEnum.nav_routing_height;
  private _totalPageWidth!: number;
  private _totalHeaderWidth = 0;
  private _totalBodyWidth = 0;
  private _totalBodyHeight = 0;

  headerPadding$: BehaviorSubject<number> = new BehaviorSubject(this._headerPadding);
  buttonBarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._buttonBarPadding);
  buttonBarHeight$: BehaviorSubject<number> = new BehaviorSubject(this._buttonBarHeight);

  totalPadding$: BehaviorSubject<number> = new BehaviorSubject(this._buttonBarHeight + this._headerPadding);

  sidebarPadding$: BehaviorSubject<number> = new BehaviorSubject(this._sidebarPadding);
  sidebarWidthAndHeight$: BehaviorSubject<number> = new BehaviorSubject(this._sidebarWidthAndHeight);
  sidebarExpanderWidth$: BehaviorSubject<number> = new BehaviorSubject(this._sidebarExpanderWidth);
  sidebarExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(this._sidebarExpanded);
  userFieldWidth$: BehaviorSubject<number> = new BehaviorSubject(this._userFieldWidth);
  navRoutingHeight$: BehaviorSubject<number> = new BehaviorSubject(this._navRoutingHeight);
  totalPageWidth$: BehaviorSubject<number> = new BehaviorSubject(this._totalPageWidth);
  totalHeaderWidth$: BehaviorSubject<number> = new BehaviorSubject(this._totalHeaderWidth);
  totalBodyWidth$: BehaviorSubject<number> = new BehaviorSubject(this._totalBodyWidth);
  totalBodyHeight$: BehaviorSubject<number> = new BehaviorSubject(this._totalBodyHeight);
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
      this._sidebarExpanderWidth = LayoutEnum.sidebar_toggle_open_width;
    } else {
      this._sidebarExpanded = false;
      this._sidebarExpanderWidth = LayoutEnum.sidebar_toggle_closed_width;
    }
    this.sidebarExpanded$.next(this._sidebarExpanded);
    this.sidebarExpanderWidth$.next(this._sidebarExpanderWidth);
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
    this.totalBodyHeight = window.innerHeight - this._totalHeaderHeight;
  }
  get totalBodyHeight(): number {
    return this._totalHeaderHeight;
  }

  set totalBodyHeight(val: number) {
    this._totalBodyHeight = val;
    this.totalBodyHeight$.next(this._totalBodyHeight);
  }
  get sidebarExpanderWidth(): number {
    return this._navRoutingHeight;
  }

  set sidebarExpanderWidth(val: number) {
    this._sidebarExpanderWidth = val;
    this.updateInnerWidth();
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
    this.totalBodyHeight = window.innerHeight - this._totalHeaderHeight;
  }
  updateInnerWidth(){
    this._totalHeaderWidth = this._totalPageWidth - this._userFieldWidth - this._sidebarPadding - this._sidebarExpanderWidth;
    this._totalBodyWidth = this._totalPageWidth - this._sidebarPadding;
    setTimeout(() => this.totalHeaderWidth$.next(this._totalHeaderWidth),0);
    setTimeout(() => this.totalBodyWidth$.next(this._totalBodyWidth),0);
  }

}
