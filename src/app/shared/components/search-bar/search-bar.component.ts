import { Component, Input, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription, Observable } from 'rxjs';
import { AdvancedSearchRequest } from 'src/app/features/home/models/search-results';
import { PolicySearchService } from '../../../features/home/services/policy-search/policy-search.service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Code } from 'src/app/core/models/code';
import { AdvancedSearchClass } from '../../classes/advanced-search-class';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { APIVersionService } from 'src/app/core/services/api-version-service/api-version.service';
import { UserAuth } from 'src/app/core/authorization/user-auth';


@Component({
  selector: 'rsps-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faSearch = faSearch;
  searchTerm = '';
  disabled = true;
  isAuthenticated = false;

  @Input() public advancedSearchRequest!: AdvancedSearchRequest;
  @Input() public collapsed = true;
  
  version = ''; // TEMP for quote create
  sub!: Subscription;
  versionSub!: Subscription;
  authSub: Subscription;
  advancedSearchClass: AdvancedSearchClass = new AdvancedSearchClass();

  constructor(private userAuth: UserAuth, private policySearchService: PolicySearchService,
     private apiService: APIVersionService
  ) { 
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
    (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
  );
}

  ngOnInit(): void {
    this.collapsed = true;
    this.versionSub = this.apiService.apiVersion$.subscribe(version => this.version = version);
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  shouldHighlightSearch(){
    if(this.collapsed)
      return "input-group-text";
    else
      return "input-group-text highlight";
  }

  clear(): void {
    this.advancedSearchClass = new AdvancedSearchClass();
    this.searchTerm = '';
  }
  search(): void {
    window.scrollTo(0,0);
    if(this.collapsed)
      this.sub = this.policySearchService.getPolicySearch(this.searchTerm).subscribe();
    else
      this.advancedSearch();
  }

  advancedSearch():void {
    window.scrollTo(0,0);
    this.advancedSearchClass.filter = this.searchTerm;
    if(this.advancedSearchClass.departmentCode != null || 
      this.advancedSearchClass.filter != '' ||
      this.advancedSearchClass.polEffEndDate != null ||
      this.advancedSearchClass.polEffStartDate != null ||
      this.advancedSearchClass.programID != null || 
      this.advancedSearchClass.srtRenewalFlag != null ||
      this.advancedSearchClass.status != null ||
      this.advancedSearchClass.subEndDate != null ||
      this.advancedSearchClass.subStartDate != null ||
      this.advancedSearchClass.underwriterID != null)
      {
        this.sub = this.policySearchService.getAdvancedSearch(this.advancedSearchClass).subscribe();
      }
  }

  filterDisplay(): string{
    return this.collapsed ? 'Search Insured, Submission, or Policy' : 'Search Submissions';
  }


}
