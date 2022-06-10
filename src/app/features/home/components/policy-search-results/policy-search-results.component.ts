import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { async, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NewEndorsementData, PolicySearchResponses, SearchResults } from 'src/app/features/home/models/search-results';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { PolicySearchService } from '../../services/policy-search/policy-search.service';
import { ActionComponent } from '../action/action.component';
import { DirectPolicyComponent } from '../direct-policy/direct-policy.component';

@Component({
  selector: 'rsps-policy-search-results',
  templateUrl: './policy-search-results.component.html',
  styleUrls: ['./policy-search-results.component.css']
})
export class PolicySearchResultsComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  searchFilter = '';
  collapsed!: boolean;
  insuredName = '';
  status = '';
  authSub: Subscription;
  canEdit = false;
  backout = false;
  searchSub!: Subscription;

  @Input('searchResults') searchResults: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: [],
    searchType: null
  };

@Input('version') version!: string;

constructor(private router: Router, private userAuth: UserAuth, public modalService: NgbModal, private policySearchService: PolicySearchService, private navigationService: NavigationService) {
  this.authSub = this.userAuth.canEditPolicy$.subscribe(
    (canEdit: boolean) => this.canEdit = canEdit
  );
}

ngOnInit(): void {
  this.searchSub = this.policySearchService.searchResults.subscribe({
    next: results => {
      let policyNumber = '';
      for (const x of results.policySearchResponses) {
        if (x.policyNumber != policyNumber) {
          x.firstPolicyRow = true;
          policyNumber = x.policyNumber;
        }
      }
      //flag for if policy endorsement can be backedout/backedin
      for (const y of results.policySearchResponses) {
        if ((y.transactionType != 'Endorsement' && y.transactionType != 'Reinstatement' && y.transactionType != 'Flat Cancel'
           && y.transactionType != 'Pro-Rata Cancel' && y.transactionType != 'Short Rate Cancel' && y.transactionType != 'Policy Extension By Endt')) {
          y.canBackOut = true;
        } else {
          y.canBackOut = false;
        }
      }
      this.searchResults.policySearchResponses = results.policySearchResponses;
      this.searchResults.submissionSearchResponses = results.submissionSearchResponses;
      this.searchResults.insuredSearchResponses = results.insuredSearchResponses;
      this.collapsed = this.searchResults.searchType != 'policy' && this.version == '2.0';


      if (results.policySearchResponses.length > 0) {
        this.insuredName = results.policySearchResponses[0].insuredName;
        const today = new Date();
        let expirationDate = new Date();
        if (results.policySearchResponses[0].policyCancelDate != null)
        {
          expirationDate = new Date(results.policySearchResponses[0].policyCancelDate);
        }
        else if (results.policySearchResponses[0].policyExtendedDate != null) {
          expirationDate = new Date(results.policySearchResponses[0].policyExtendedDate);
        }
        else {
          expirationDate = new Date(results.policySearchResponses[0].policyExpirationDate);
        }
        if (today <= expirationDate) {
          this.status = 'InForce';
        }
        else if (results.policySearchResponses[0].policyCancelDate != null) {
          this.status = 'Cancelled';
        }
        else {
          this.status = 'Expired';
        }
      }
    },
    // error: err => this.errorMessage = err
  });
}


openPolicy(policy: PolicySearchResponses): void {
  this.navigationService.resetPolicy();
  this.router.navigate(['/policy/' + policy.policyId.toString() + '/' + policy.endorsementNumber.toString()]);
}
  @ViewChild('actionModal') private actionComponent: ActionComponent | undefined;
  @ViewChild('modalPipe') modalPipe: any;
  @ViewChild('modal') directPolicyComponent!: DirectPolicyComponent;

  async newEndorsement(policy: PolicySearchResponses, event: any) {
    console.log(this.directPolicyComponent);
    const filtered = this.searchResults.policySearchResponses.filter(x => x.policyId == policy.policyId).filter(y => y.invoiceStatus == null);
    if (filtered.length > 0){
      this.modalService.open(this.modalPipe);
      return;
    }
    if (this.actionComponent != null && event.target.value == 'endorsement') {
      const endorsementAction: NewEndorsementData = ({} as any) as NewEndorsementData;
      await this.actionComponent.endorsementPopup(endorsementAction, policy);
    } else if (this.actionComponent != null && event.target.value == 'backout') {
      const endorsementAction: NewEndorsementData = ({} as any) as NewEndorsementData;
      await this.actionComponent.backoutPopup(endorsementAction, policy);
    } else if(this.actionComponent != null && event.target.value == 'cancelRewrite'){
      const endorsementAction: NewEndorsementData = ({} as any) as NewEndorsementData;
      const premium: number = this.searchResults.policySearchResponses.filter(x => x.invoiceStatus != 'V' && x.policyId == policy.policyId).reduce((premium, current)=> premium += current.amount, 0);
      endorsementAction.premium = -premium;
      await this.actionComponent.cancelRewritePopup(endorsementAction, policy);
    } else if (this.directPolicyComponent != null && event.target.value == 'rewrite'){
      this.directPolicyComponent.openRewrite(policy);
    }
  }

}
