import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { AdditionalInterestClass } from '../additional-interest-class';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { deepClone } from 'src/app/core/utils/deep-clone';

import { QuoteDataValidationService } from 'src/app/features/quote/services/quote-data-validation-service/quote-data-validation-service.service';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';

@Component({
  selector: 'rsps-additional-interest-group',
  templateUrl: './additional-interest-group.component.html',
  styleUrls: ['./additional-interest-group.component.css']
})
export class AdditionalInterestGroupComponent implements OnInit {

  invalidMessage = '';
  showInvalid = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  color: ThemePalette = 'warn';
  invalidList: string[] = [];
  isNew = false;
  collapsed = false;
  program!: ProgramClass | null;
  quoteId = 0;
  programSub!: Subscription;
  constructor(private notification: NotificationService,private userAuth: UserAuth, private route: ActivatedRoute,
    private pageDataService: PageDataService, private quoteDataValidationService: QuoteDataValidationService) {
  }

  @Input() public aiData: AdditionalInterestClass[] = [];
  @Input() public newAi!: AdditionalInterestClass;
  @Input() public canEdit = false;

  ngOnInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        this.program = selectedProgram;
        if (this.program?.quoteData instanceof PropertyQuoteClass && this.program?.quoteData?.propertyQuoteAdditionalInterestList){
          this.aiData = this.program?.quoteData?.propertyQuoteAdditionalInterestList;
        }
      });
    this.collapsed = false;
  }
  isValid(): boolean {
    let valid = true;
    this.invalidList = [];
    this.aiData?.forEach(c => {
      if (!c.isValid) {
        valid = false;
        this.invalidList = this.invalidList.concat(c.invalidList);
      }
    });
    return valid;
  }

  isDirty() {
    return this.aiData?.some(item => item.isDirty);
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyExisitingAdditionalInterest(existingAi: AdditionalInterestClass) {
    const clone = deepClone(existingAi.toJSON());
    const newAi = new AdditionalInterestClass(clone);
    newAi.propertyQuoteAdditionalInterestId = 0;
    newAi.guid = crypto.randomUUID();
    newAi.interest = 'CopyOf ' + existingAi.interest;
    newAi.isNew = true;
    newAi.additionalInterestType = 1;
    this.aiData?.push(newAi);
  }

  deleteExistingAdditionalInterest(existingAi: AdditionalInterestClass) {
    const index = this.aiData?.indexOf(existingAi, 0);
    if (index > -1) {
      this.aiData?.splice(index, 1);
      if (!existingAi.isNew) {
        this.notification.show('Mortgagee deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  addNewAdditionalInterest(): void {
    const mort: AdditionalInterestClass = new AdditionalInterestClass();
    mort.isNew = true;
    this.aiData?.push(mort);
    ///this.program?.quoteData?.validate();
    this.quoteDataValidationService.updateQuoteValidations(this.program?.quoteData || null);
  }

}
