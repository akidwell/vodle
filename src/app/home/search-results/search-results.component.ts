import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewEndorsementData, PolicySearchResults } from './policy-search-results';
import { PolicySearchService } from './policy-search.service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { PolicyHistoryService } from 'src/app/navigation/policy-history/policy-history.service';
import { ActionComponent } from './action/action.component';
import { NavigationService } from 'src/app/policy/services/navigation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'rsps-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  searchFilter: string = "";
  searchResults!: PolicySearchResults[];
  searchSub!: Subscription;
  loadingSub!: Subscription;
  loading: boolean = false;
  collapsed: boolean = false;
  insuredName: string = "";
  status: string = "";

  constructor(private router: Router, private route: ActivatedRoute,  public modalService: NgbModal,  private policySearchService: PolicySearchService, private policyHistoryService: PolicyHistoryService, private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.loadingSub = this.policySearchService.loading$.subscribe({
      next: results => {
        this.loading = results;
      }
    });
    this.searchSub = this.policySearchService.searchResults.subscribe({
      next: results => {
        // Flag for every new policy number
        let policyNumber: string = "";
        for (let x of results) {
          if (x.policyNumber != policyNumber) {
            x.firstPolicyRow = true;
            policyNumber = x.policyNumber;
          }
        }

        this.searchResults = results;

        if (results.length > 0) {
          this.insuredName = results[0].insuredName;
          let date = new Date();
          let date2 = new Date();
          if (results[0].policyExtendedDate != null) {
            date2 = new Date(results[0].policyExtendedDate);
          }
          else {
            date2 = new Date(results[0].policyExpirationDate);
          }
          if (date <= date2) {
            this.status = "InForce";
          }
          else {
            this.status = "Expired";
          }
        }
      },
      // error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.loadingSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  openPolicy(policy: PolicySearchResults): void {
    this.navigationService.resetPolicy();
    this.router.navigate(['/policy/' + policy.policyId.toString() + '/' + policy.endorsementNumber.toString()]);
  }
  @ViewChild('modal') private actionComponent: ActionComponent | undefined
  @ViewChild('modalPipe') modalPipe: any;


  async newEndorsement(policy: PolicySearchResults) {
    let filtered = this.searchResults.filter(x => x.policyId == policy.policyId).filter(y => y.invoiceStatus == null)
    if (filtered.length > 0){
      this.modalService.open(this.modalPipe)
      return;
    }
    if (this.actionComponent != null) {
      let endorsementAction: NewEndorsementData = ({} as any) as NewEndorsementData;
      console.log(policy)
      await this.actionComponent.endorsementPopup(endorsementAction, policy);
    }
  }
}