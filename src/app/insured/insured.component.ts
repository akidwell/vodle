import { Component, OnInit, ViewChild } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { PolicyService } from '../policy/policy.service';
import { coverageANI, insuredANI } from '../shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from '../shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';

@Component({
  selector: 'rsps-insured',
  templateUrl: './insured.component.html',
  styleUrls: ['./insured.component.css']
})
export class InsuredComponent implements OnInit {

  aniData: coverageANI[]= [];
  addSub!: Subscription;

  @ViewChild(SharedAdditionalNamedInsuredsGroupComponent) aniGroupComp!: SharedAdditionalNamedInsuredsGroupComponent;

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

        let x = Object.assign(new insuredANI(), AdditionalNamedInsured[0])
        //let x = Object.assign(new coverageANI(), AdditionalNamedInsured[0])

        // let testCoverage = new coverageANI();
        // testCoverage.name = "TEST Coverege"
        // this.aniData.push(testCoverage);

       // this.aniData.push(AdditionalNamedInsured[0]);
        this.aniData.push(x);
      }  
    );
  }

  save() {
    this.aniGroupComp.saveAdditionalNamedInsureds();
  }

}
