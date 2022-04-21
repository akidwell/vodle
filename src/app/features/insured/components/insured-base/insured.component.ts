import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { coverageANI, insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from 'src/app/shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';
import { Insured } from '../../models/insured';
import { InsuredService } from '../../services/insured-service/insured.service';


@Component({
  selector: 'rsps-insured',
  templateUrl: './insured.component.html',
  styleUrls: ['../../../../app.component.css','./insured.component.css']
})
export class InsuredComponent implements OnInit {
  insured!: Insured;
  aniCoverageData: coverageANI[]= [];
  aniInsuredData: insuredANI[]= [];
  addSub!: Subscription;
  newCoverageANI!: coverageANI;
  newInsuredANI!: insuredANI;

  @ViewChild(SharedAdditionalNamedInsuredsGroupComponent) aniGroupComp!: SharedAdditionalNamedInsuredsGroupComponent;
  @ViewChildren(SharedAdditionalNamedInsuredsGroupComponent) invoiceGroupComp: QueryList<SharedAdditionalNamedInsuredsGroupComponent> | undefined;

  constructor(private route: ActivatedRoute, private policyService: PolicyService, private insuredService: InsuredService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.insured = data['insuredData'].insured;
      this.aniInsuredData = data['aniData'].additionalNamedInsureds;
    });

    this.newCoverageANI = new coverageANI(this.policyService);
    this.newCoverageANI.policyId = 314105;
    this.newCoverageANI.endorsementNo = 0;

    this.newInsuredANI = new insuredANI(this.insuredService);
    this.newInsuredANI.insuredCode = 486894;

    this.addSub = this.policyService.getAdditionalNamedInsured(Number(314105), Number(0))
    .subscribe(
      AdditionalNamedInsured => {
        this.aniCoverageData = AdditionalNamedInsured;
      }  
    );

    // this.insuredService.getInsuredAdditionalNamedInsured(Number(486894))
    // .subscribe(
    //   AdditionalNamedInsured => {
    //     this.aniInsuredData = AdditionalNamedInsured;
    //   }  
    // );
    
  }

  ngOnDestroy(): void {
    this.addSub?.unsubscribe();
  }

  save() {
    this.invoiceGroupComp?.get(0)?.saveAdditionalNamedInsureds();
  }

  saveInsured() {
    this.invoiceGroupComp?.get(1)?.saveAdditionalNamedInsureds();
  }
}
