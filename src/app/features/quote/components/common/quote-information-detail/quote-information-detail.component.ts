import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DepartmentClass } from '../../../classes/department-class';

@Component({
  selector: 'rsps-quote-information-detail',
  templateUrl: './quote-information-detail.component.html',
  styleUrls: ['./quote-information-detail.component.css']
})
export class QuoteInformationDetailComponent implements OnInit {
  @Input() public department!: DepartmentClass;
  authSub: Subscription;
  canEditSubmission = false;
  availableAdmittedOptions: Code[] = [];
  availableClaimsMadeOccurrenceOptions: Code[] = [];
  constructor(private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  ngOnInit(): void {
    if (this.department.claimsMadeAvailable) {
      const cm: Code = {
        code: 'C',
        key: 1,
        description: 'Claims-Made'
      };
      this.availableClaimsMadeOccurrenceOptions.push(cm);
    }
    if (this.department.occurrenceAvailable) {
      const occ: Code = {
        code: 'O',
        key: 2,
        description: 'Occurrence'
      };
      this.availableClaimsMadeOccurrenceOptions.push(occ);
    }
    if (this.department.admittedAvailable) {
      const admit: Code = {
        code: 'A',
        key: 1,
        description: 'Admitted'
      };
      this.availableAdmittedOptions.push(admit);
    }
    if (this.department.nonAdmittedAvailable) {
      const nonAdmit: Code = {
        code: 'N',
        key: 2,
        description: 'Non-Admitted'
      };
      this.availableAdmittedOptions.push(nonAdmit);
    }
    console.log(this.department);
  }
  updateGlobalSettings() {
    this.department.programMappings.forEach(program => {
      program.updateGlobalDefaults(this.department.activeAdmittedStatus, this.department.activeClaimsMadeOrOccurrence);
      if (program.quoteData != null) {
        program.updateGlobalSettings(this.department.activeAdmittedStatus, this.department.activeClaimsMadeOrOccurrence);
      }
    });
  }
}
