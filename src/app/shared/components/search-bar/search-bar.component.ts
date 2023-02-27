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
  sub!: Subscription;
  advancedSearchRequest!: AdvancedSearchRequest;
  disabled = true;
  collapsed = true;
  departments$: Observable<Code[]> | undefined;
  submissionStatuses$: Observable<Code[]> | undefined;
  underwriters$: Observable<Code[]> | undefined;
  programs$: Observable<Code[]> | undefined;
  advancedSearchClass: AdvancedSearchClass = new AdvancedSearchClass();

  constructor(private policySearchService: PolicySearchService, 
    private dropdowns: DropDownsService, private datePipe: DatePipe) {
      
    }

  ngOnInit(): void {
    this.collapsed = true;
    this.departments$ = this.dropdowns.getDepartments(null);
    this.submissionStatuses$ = this.dropdowns.getSubmissionStatuses();
    this.underwriters$ = this.dropdowns.getUnderwriters(); 
    this.programs$ = this.dropdowns.getPrograms();
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  clear(): void {
    this.advancedSearchClass = new AdvancedSearchClass();
    this.searchTerm = "";
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
    this.sub = this.policySearchService.getAdvancedSearch(this.advancedSearchClass).subscribe();
  }

  filterDisplay(): string{
    return this.collapsed ? "Search Insured, Submission, or Policy" : "Search Submissions";
  }

 
}
