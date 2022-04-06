import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Endorsement } from '../../models/policy';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

@Component({
  selector: 'rsps-policy-layer-header',
  templateUrl: './policy-layer-header.component.html',
  styleUrls: ['./policy-layer-header.component.css']
})
export class PolicyLayerHeaderComponent implements OnInit {
  endorsement!: Endorsement;
  isReadOnly: boolean = true;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  canEditTransactionType: boolean = false;
  reinsuranceLayerNo!: number;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;  
      }
    });
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsement = data['endorsementData'].endorsement;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  get canEditPremium(): boolean {
    return this.canEditEndorsement && this.canEditPolicy && this.endorsementStatusService.directQuote;
  }
}