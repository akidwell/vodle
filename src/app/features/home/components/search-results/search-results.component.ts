import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NewEndorsementData, PolicySearchResults } from '../../models/policy-search-results';
import { PolicySearchService } from '../../services/policy-search/policy-search.service';
import { ActionComponent } from '../action/action.component';
import { DirectPolicyComponent } from '../direct-policy/direct-policy.component';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';

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
  authSub: Subscription;
  canEdit: boolean = false;
  backout: boolean = false;

  constructor(private router: Router, private userAuth: UserAuth, public modalService: NgbModal,  private policySearchService: PolicySearchService, private navigationService: NavigationService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEdit: boolean) => this.canEdit = canEdit
    );}

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
        //flag for if policy endorsement can be backedout/backedin
        for (let y of results) {
          if ((y.transactionType != 'Endorsement' && y.transactionType != 'Reinstatement' && y.transactionType != 'Flat Cancel'
           && y.transactionType != 'Pro-Rata Cancel' && y.transactionType != 'Short Rate Cancel' && y.transactionType != 'Policy Extension By Endt')) {
            y.canBackOut = true;
          } else {
            y.canBackOut = false;
          }
        }

        this.searchResults = results;
        if (results.length > 0) {
          this.insuredName = results[0].insuredName;
          let today = new Date();
          let expirationDate = new Date();
          if (results[0].policyCancelDate != null)
          {
            expirationDate = new Date(results[0].policyCancelDate);
          }
          else if (results[0].policyExtendedDate != null) {
            expirationDate = new Date(results[0].policyExtendedDate);
          }
          else {
            expirationDate = new Date(results[0].policyExpirationDate);
          }
          if (today <= expirationDate) {
            this.status = "InForce";
          }
          else if (results[0].policyCancelDate != null)  {
            this.status = "Cancelled";
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
  @ViewChild('actionModal') private actionComponent: ActionComponent | undefined
  @ViewChild('modalPipe') modalPipe: any;
  @ViewChild('modal') private directPolicyComponent!: DirectPolicyComponent

  async newEndorsement(policy: PolicySearchResults, event: any) {
    let filtered = this.searchResults.filter(x => x.policyId == policy.policyId).filter(y => y.invoiceStatus == null)
    if (filtered.length > 0){
      this.modalService.open(this.modalPipe)
      return;
    }
    if (this.actionComponent != null && event.target.value == "endorsement") {
      let endorsementAction: NewEndorsementData = ({} as any) as NewEndorsementData;
      await this.actionComponent.endorsementPopup(endorsementAction, policy, this.status);
    } else if (this.actionComponent != null && event.target.value == "backout") {
      let endorsementAction: NewEndorsementData = ({} as any) as NewEndorsementData;
      await this.actionComponent.backoutPopup(endorsementAction, policy, this.status);
    } else if(this.actionComponent != null && event.target.value == "cancelRewrite"){
      let endorsementAction: NewEndorsementData = ({} as any) as NewEndorsementData;
      let premium: number = this.searchResults.filter(x => x.invoiceStatus != 'V' && x.policyId == policy.policyId).reduce((premium, current)=> premium += current.amount, 0)
      endorsementAction.premium = -premium;
      await this.actionComponent.cancelRewritePopup(endorsementAction, policy, this.status);
     } else if (this.directPolicyComponent != null && event.target.value == "rewrite"){
       this.directPolicyComponent.openRewrite(policy)
      }
  }

}
