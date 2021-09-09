import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/policy/policy';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { Subscription } from 'rxjs';
import { Code } from 'src/app/drop-downs/code';

@Component({
  selector: 'rsps-policy-information',
  templateUrl: './policy-information.component.html',
  styleUrls: ['./policy-information.component.css']
})
export class PolicyInformationComponent implements OnInit {
  policy!: Policy;
  isReadOnly: boolean = true;
  policyCollapsed = false;
  faPlus = faPlus;
  faMinus = faMinus;
  subPACCodes!: Subscription;
  subRiskGrades!: Subscription;
  subStates!: Subscription;
  subCarrierCodes!: Subscription;
  subCoverageCodes!: Subscription;

  subAuditCodes!: Subscription;
  subPaymentFrequencies!: Subscription;
  subDeregulationIndicators!: Subscription;
  subRiskTypes!: Subscription;
  subNYFreeTradeZones!: Subscription;
  subAssumedCarriers!: Subscription;

  pacCodes: Code[] = [];
  riskGrades: Code[] = [];
  states: Code[] = [];
  carrierCodes: Code[] = [];
  coverageCodes: Code[] = [];

  auditCodes: Code[] = [];
  paymentFrequencies: Code[] = [];
  deregulationIndicators: Code[] = [];
  riskTypes: Code[] = [];
  nyFreeTradeZones: Code[] = [];
  assumedCarriers: Code[] = [];

  constructor(private route: ActivatedRoute, private dropdowns: DropDownsService) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policy = data['resolvedData'].policy;
    });

    this.subPACCodes = this.dropdowns.getPACCodes().subscribe({
      next: pacCodes => {
        this.pacCodes = pacCodes;
      }
    });
    this.subRiskGrades = this.dropdowns.getRiskGrades(62).subscribe({
      next: riskGrades => {
        this.riskGrades = riskGrades;
      }
    });
    this.subStates = this.dropdowns.getStates().subscribe({
      next: states => {
        this.states = states;
      }
    });
    this.subCarrierCodes = this.dropdowns.getCarrierCodes().subscribe({
      next: carrierCodes => {
        this.carrierCodes = carrierCodes;
      }
    });
    this.subCoverageCodes = this.dropdowns.getCoverageCodes().subscribe({
      next: coverageCodes => {
        this.coverageCodes = coverageCodes;
      }
    });
    this.subAuditCodes = this.dropdowns.getAuditCodes().subscribe({
      next: auditCodes => {
        this.auditCodes = auditCodes;
      }
    });
    this.subPaymentFrequencies = this.dropdowns.getPaymentFrequencies().subscribe({
      next: paymentFrequencies => {
        this.paymentFrequencies = paymentFrequencies;
      }
    });
    this.subDeregulationIndicators = this.dropdowns.getDeregulationIndicators().subscribe({
      next: deregulationIndicators => {
        this.deregulationIndicators = deregulationIndicators;
      }
    });
    this.subRiskTypes = this.dropdowns.getRiskTypes().subscribe({
      next: riskTypes => {
        this.riskTypes = riskTypes;
      }
    });
    this.subNYFreeTradeZones = this.dropdowns.getNYFreeTradeZones().subscribe({
      next: nyFreeTradeZones => {
        this.nyFreeTradeZones = nyFreeTradeZones;
      }
    });
    this.subAssumedCarriers = this.dropdowns.getAssumedCarriers().subscribe({
      next: assumedCarriers => {
        this.assumedCarriers = assumedCarriers;
      }
    });
  }

  ngOnDestroy(): void {
    this.subPACCodes.unsubscribe();
    this.subRiskGrades.unsubscribe();
    this.subStates.unsubscribe();
    this.subCarrierCodes.unsubscribe();
    this.subCoverageCodes.unsubscribe();
  }

}
