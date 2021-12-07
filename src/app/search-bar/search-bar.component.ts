import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PolicySearchService } from '../home/search-results/policy-search.service';

@Component({
  selector: 'rsps-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  faSearch = faSearch;
  searchTerm: string = "";
  sub!: Subscription;
  disabled: boolean = true;

  private _loading$ = new BehaviorSubject<boolean>(true);
  get loading$() { return this._loading$.asObservable(); }

  constructor(private policySearchService: PolicySearchService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  search(): void {
    this.sub = this.policySearchService.getPolicySearch(this.searchTerm).subscribe();
  }

}
