import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PolicySearchService } from '../home/search-results/policy-search.service';
import { PolicyService } from '../policy/policy.service';

@Component({
  selector: 'rsps-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  faSearch = faSearch;
  searchTerm: string = "";
  sub!: Subscription;

  private _loading$ = new BehaviorSubject<boolean>(true);
  get loading$() { return this._loading$.asObservable(); }

  constructor(private router: Router, private policySearchService: PolicySearchService, private account: PolicyService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  search(): void {
    this.sub = this.policySearchService.getPolicySearch(this.searchTerm).subscribe();
  }

}
