import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountInformation, PolicyInformation } from '../../models/policy';
import { FormatDateForDisplay } from '../../../../core/services/format-date/format-date-display.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

@Component({
  selector: 'rsps-policy-header',
  templateUrl: './policy-header.component.html',
  styleUrls: ['./policy-header.component.css']
})
export class PolicyHeaderComponent implements OnInit {
  endorsementNumber = 0;
  statusSub!: Subscription;
  status = '';
  formatDateForDisplay: FormatDateForDisplay;
  @Input() public policyInfo!: PolicyInformation;
  @Input() public accountInfo!: AccountInformation;

  constructor(private route: ActivatedRoute, private endorsementStatusService: EndorsementStatusService, private formatDateService: FormatDateForDisplay) {
    this.formatDateForDisplay = formatDateService;
  }

  ngOnInit(): void {
    this.route.data.subscribe(() => {
      this.endorsementNumber = Number(this.route.snapshot.paramMap.get('end') ?? 0);
    });

    this.statusSub = this.endorsementStatusService.status.subscribe({
      next: status => {
        this.status = status;
      }
    });
  }
  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
  }

}
