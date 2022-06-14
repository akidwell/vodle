import { Component } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PolicySearchService } from '../../../features/home/services/policy-search/policy-search.service';

@Component({
  selector: 'rsps-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  faSearch = faSearch;
  searchTerm = '';
  sub!: Subscription;
  disabled = true;
  loadingSub!: Subscription;
  loading = false;

  private _loading$ = new BehaviorSubject<boolean>(true);
  get loading$() { return this._loading$.asObservable(); }

  constructor(private policySearchService: PolicySearchService) { }

  ngOnInit(): void {
    this.loadingSub = this.policySearchService.loading$.subscribe({
      next: results => {
        this.loading = results;
      }
    });
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  search(): void {
    window.scrollTo(0,0);
    this.sub = this.policySearchService.getPolicySearch(this.searchTerm).subscribe();
  }

}
