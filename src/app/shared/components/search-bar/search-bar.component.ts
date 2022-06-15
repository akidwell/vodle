import { Component } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
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

  constructor(private policySearchService: PolicySearchService) { }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  search(): void {
    window.scrollTo(0,0);
    this.sub = this.policySearchService.getPolicySearch(this.searchTerm).subscribe();
  }

}
