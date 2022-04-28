import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { coverageANI, insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from 'src/app/shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';
import { Insured } from '../../models/insured';
import { InsuredContact } from '../../models/insured-contact';
import { InsuredService } from '../../services/insured-service/insured.service';
import { InsuredAccountComponent } from '../insured-account/insured-account.component';


@Component({
  selector: 'rsps-insured',
  templateUrl: './insured.component.html',
  styleUrls: ['../../../../app.component.css', './insured.component.css']
})
export class InsuredComponent implements OnInit {
  // insured!: Insured;
  // aniCoverageData: coverageANI[] = [];
  // aniInsuredData: insuredANI[] = [];
  // addSub!: Subscription;
  // newCoverageANI!: coverageANI;
  // newInsuredANI!: insuredANI;
  // canEditInsured: boolean = false;
  // canEditPolicy: boolean = true;
  // authSub: Subscription;
  // contacts: InsuredContact[] = [];

  // @ViewChild(SharedAdditionalNamedInsuredsGroupComponent) aniGroupComp!: SharedAdditionalNamedInsuredsGroupComponent;
  // @ViewChildren(SharedAdditionalNamedInsuredsGroupComponent) invoiceGroupComp: QueryList<SharedAdditionalNamedInsuredsGroupComponent> | undefined;
  // @ViewChild(InsuredAccountComponent) accountInfoComp!: InsuredAccountComponent;

  constructor(private route: ActivatedRoute, private router: Router, private config: ConfigService, private policyService: PolicyService, private insuredService: InsuredService) {
    // this.authSub = this.userAuth.canEditInsured$.subscribe(
    //   (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    // );
  }

  ngOnInit(): void {
    // this.route.data.subscribe(data => {
    //   this.insured = data['insuredData'].insured;
    //   this.aniInsuredData = data['aniData'].additionalNamedInsureds;
    // });

    // this.newCoverageANI = new coverageANI(this.policyService);
    // this.newCoverageANI.policyId = 314105;
    // this.newCoverageANI.endorsementNo = 0;

    // this.newInsuredANI = new insuredANI(this.insuredService);
    // this.newInsuredANI.insuredCode = 486894;

    // this.addSub = this.policyService.getAdditionalNamedInsured(Number(314105), Number(0))
    //   .subscribe(
    //     AdditionalNamedInsured => {
    //       this.aniCoverageData = AdditionalNamedInsured;
    //     }
    //   );

    // this.insuredService.getInsuredAdditionalNamedInsured(Number(486894))
    // .subscribe(
    //   AdditionalNamedInsured => {
    //     this.aniInsuredData = AdditionalNamedInsured;
    //   }  
    // );
    //If the policy module is loaded and the user is not trying to access policy information we need to redirect them to policy information
    if (this.router.url.split('/').slice(-1)[0] != 'information' && !this.config.preventForcedRedirect) {
      this.doRedirect()
    }
  }

  doRedirect() {
    var urlString = this.router.url.split('/').slice(0, -1).join('/') + '/information'
    setTimeout(() => {
      this.router.navigate([urlString], { state: { bypassFormGuard: true } })
    })
  }


  ngOnDestroy(): void {
    // this.authSub.unsubscribe();
    // this.addSub?.unsubscribe();
  }

  // isValid(): boolean {
  //   if (!this.canEditInsured) {
  //     return true;
  //   }
  //   return this.accountInfoComp.accountInfoForm.status == 'VALID';
  // }

  // isDirty(): boolean {
  //   return this.canEditInsured && ((this.accountInfoComp.accountInfoForm.dirty == true) ? true : false);
  // }

  // save(): void {
  //   this.saveInsured().subscribe(() => {
  //     this.saveInsuredANI();
  //   });
  // }


  // saveInsured(): Observable<boolean> {
  //   var subject = new Subject<boolean>();
  //   //if (this.policyInfoComp.allowEndorsementSave()) {
  //   this.insuredService.updateInsured(this.insured).subscribe(() => {
  //     subject.next(true)
  //   });
  //   //} else {
  //   //  setTimeout(() => subject.next(true), 0)
  //   // }
  //   return subject.asObservable();
  // }

  // saveANI() {
  //   this.invoiceGroupComp?.get(0)?.saveAdditionalNamedInsureds();
  // }

  // saveInsuredANI() {
  //   this.invoiceGroupComp?.get(1)?.saveAdditionalNamedInsureds();
  // }
}
