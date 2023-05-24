import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountInformation, PolicyInformation } from '../../models/policy';
import { FormatDateForDisplay } from '../../../../core/services/format-date/format-date-display.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';

@Component({
  selector: 'rsps-policy-header',
  templateUrl: './policy-header.component.html',
  styleUrls: ['./policy-header.component.css']
})
export class PolicyHeaderComponent implements OnInit {
  statusSub!: Subscription;
  status = '';
  formatDateForDisplay: FormatDateForDisplay;
  @Input() public policyInfo!: PolicyClass;
  @Input() public accountInfo!: AccountInformation;
  @Input() public endorsementNumber!: number | null;

  constructor(private route: ActivatedRoute, private endorsementStatusService: EndorsementStatusService, private formatDateService: FormatDateForDisplay) {
    this.formatDateForDisplay = formatDateService;
  }

  ngOnInit(): void {
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
