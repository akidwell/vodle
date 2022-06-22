import { Component, OnInit } from '@angular/core';
import { faFileAlt, faFileImport, faHome, faToolbox, faAngleDown, faAngleUp, faFolderOpen, faFolder, faStar as faSolidStar, faFolderPlus, faBars, faX, faCommentDollar, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { UserAuth } from '../../authorization/user-auth';
import { Subscription } from 'rxjs';
import { HistoryService } from '../../services/policy-history/policy-history.service';
import { Router } from '@angular/router';
import { History } from '../../services/policy-history/policy-history';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { HeaderPaddingService } from '../../services/header-padding-service/header-padding.service';
import { LayoutEnum } from '../../enums/layout-enum';

@Component({
  selector: 'rsps-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['../../../app.component.css', './navigation.component.css']
})
export class NavigationComponent implements OnInit {
  reportNavbarOpen = false;
  applicationNavbarOpen = false;
  isAuthenticated = false;
  faFileAlt = faFileAlt;
  faFileImport = faFileImport;
  faHome = faHome;
  faToolbox = faToolbox;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faFolderOpen = faFolderOpen;
  faFolder = faFolder;
  faSolidStar = faSolidStar;
  faStar = faStar;
  faFolderPlus = faFolderPlus;
  faBars = faBars;
  faX = faX;
  faChartLine = faChartLine;
  faCommentDollar = faCommentDollar;
  authSub: Subscription;
  editSub: Subscription;
  policyHistory: History[] = [];
  policySub!: Subscription;
  showFav = false;
  canEditPolicy = false;
  showFullSidebar = localStorage.getItem('show-sidebar') === 'false' ? false : true;
  sidebarMinWidth = LayoutEnum.sidebar_min_width;
  sidebarMaxWidth = LayoutEnum.sidebar_width;
  sidebarStartingWidth: number;

  constructor(private userAuth: UserAuth, private historyService: HistoryService, private navigationService: NavigationService, private router: Router, public headerPaddingService: HeaderPaddingService) {
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
    this.editSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
    historyService.loadInfo();
    this.sidebarStartingWidth = this.showFullSidebar ? LayoutEnum.sidebar_width : 0;
    this.headerPaddingService.sidebarPadding = this.showFullSidebar ? LayoutEnum.sidebar_width : 0;
    this.headerPaddingService.sidebarWidthAndHeight = this.showFullSidebar ? 100 : 0;
  }

  async ngOnInit() {
    this.policySub = this.historyService.policyHistory$.subscribe({
      next: results => {
        this.policyHistory = results;
      }
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.editSub.unsubscribe();
    this.policySub?.unsubscribe();
  }

  toggleReportNavbar() {
    this.reportNavbarOpen = !this.reportNavbarOpen;
  }

  toggleApplicationNavbar() {
    this.applicationNavbarOpen = !this.applicationNavbarOpen;
  }

  openPolicy(): void {
    this.navigationService.resetPolicy();
  }

  favorite(history: History) {
    history.favorite = this.historyService.favoriteHistory(history.id, true);
  }
  unfavorite(history: History) {
    history.favorite = this.historyService.favoriteHistory(history.id, false);
  }

  hoverFavorite(history: History) {
    history.hover = true;
  }
  unhoverFavorite(history: History) {
    history.hover = false;
  }
  toggleSidebar() {
    this.showFullSidebar = !this.showFullSidebar;
    localStorage.setItem('show-sidebar', this.showFullSidebar.toString());
    if (this.showFullSidebar) {
      this.headerPaddingService.sidebarPadding = LayoutEnum.sidebar_width;
      this.headerPaddingService.sidebarWidthAndHeight = 100;
    } else {
      this.headerPaddingService.sidebarPadding = 0;
      this.headerPaddingService.sidebarWidthAndHeight = 0;
    }
  }
  createDirectPolicy() {
    this.router.navigate(['/home']).then(() => {
      setTimeout(() => {
        this.navigationService.create();
      });
    });
  }
}
