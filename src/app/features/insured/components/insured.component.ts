import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { coverageANI, insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from 'src/app/shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';


@Component({
  selector: 'rsps-insured',
  templateUrl: './insured.component.html',
  styleUrls: ['../../../app.component.css','./insured.component.css']
})
export class InsuredComponent implements OnInit {

  aniCoverageData: coverageANI[]= [];
  aniInsuredData: insuredANI[]= [];
  addSub!: Subscription;

  policyId: number = 314105;
  endorsementNo: number = 0;

  addInsuredCode: number = 314105;
  insuredCode: number = 0;

  @ViewChild(SharedAdditionalNamedInsuredsGroupComponent) aniGroupComp!: SharedAdditionalNamedInsuredsGroupComponent;

  @ViewChildren(SharedAdditionalNamedInsuredsGroupComponent) invoiceGroupComp: QueryList<SharedAdditionalNamedInsuredsGroupComponent> | undefined;

  constructor(private policyService: PolicyService) { 


   
    // let testCoverage = new coverageANI();
    // testCoverage.name = "TEST Coverege"
    // this.aniData.push(testCoverage);

    // let testInsured = new insuredANI();
    // testInsured.name = "TEST Insured"
    // this.aniData.push(testInsured);
  }

  ngOnInit(): void {
    this.addSub = this.policyService.getAdditionalNamedInsured(Number(314105), Number(0))
    .subscribe(
      AdditionalNamedInsured => {

       // this.aniCoverageData = new coverageANI(AdditionalNamedInsured);

        // let z = new coverageANI();
        
        AdditionalNamedInsured.forEach(x => {
           let z = new coverageANI(x);
          // z.Populate(x);
          // z = <coverageANI>x;
          this.aniCoverageData.push(z);
        });

        //let x = Object.assign(new insuredANI(), AdditionalNamedInsured[0])
        //let x = Object.assign(new coverageANI(), AdditionalNamedInsured[0])

        // let testCoverage = new coverageANI();
        // testCoverage.name = "TEST Coverege"
        // this.aniData.push(testCoverage);

       // this.aniData.push(AdditionalNamedInsured[0]);
        //this.aniCoverageData.push(x);


         // let y = Object.assign(new coverageANI(), AdditionalNamedInsured[0])
         // this.aniInsuredData.push(x);

        //  AdditionalNamedInsured.forEach(x => {
        //   // let z = new coverageANI(x);
        //   // z = <coverageANI>x;
        //   this.aniInsuredData.push(new insuredANI(x));
        // });
      }  
    );

    this.policyService.getInsuredAdditionalNamedInsured(Number(486894))
    .subscribe(
      AdditionalNamedInsured => {

      
         AdditionalNamedInsured.forEach(x => {
          // let z = new coverageANI(x);
          // z = <coverageANI>x;
          this.aniInsuredData.push(new insuredANI(x));
        });
      }  
    );
    
  }

  save() {
    this.invoiceGroupComp?.get(0)?.saveAdditionalNamedInsureds();
  }

  saveInsured() {
    this.invoiceGroupComp?.get(1)?.saveAdditionalNamedInsureds();
  }
}
