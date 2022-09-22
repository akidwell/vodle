import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { HistoricRoute } from 'src/app/core/models/historic-route';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { SubmissionClass } from 'src/app/features/submission/classes/SubmissionClass';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';
import { InsuredClass } from '../../classes/insured-class';
import { Insured } from '../../models/insured';
import { newInsuredDupeRequst } from '../../models/insured-dupe-request';
import { InsuredService } from '../../services/insured-service/insured.service';
import { InsuredDuplicatesComponent } from '../insured-duplicates/insured-duplicates.component';

@Component({
  selector: 'rsps-insured-header',
  templateUrl: './insured-header.component.html',
  styleUrls: ['./insured-header.component.css']
})

export class InsuredHeaderComponent {
  @Input() public insured!: Insured;
  @Input() public showSubmissionSave?: boolean;
  @Input() public showInsuredSave?: boolean;
  @ViewChild('modal') private dupeComponent!: InsuredDuplicatesComponent;

  faSave = faSave;
  faLeft = faLeftLong;

  isBusy = false;
  showBusy = false;




  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmissionService,
    private insuredService: InsuredService,
    public pageDataService: PageDataService,
    private notification: NotificationService,
    private messageDialogService: MessageDialogService,
    private quoteService: QuoteService,) {

  }
  async saveSubmission() {
    let sub: SubmissionClass;
    if (this.pageDataService.submissionData == null) {
      return;
    } else {
      sub = this.pageDataService.submissionData;
    }

    if (sub.isValid) {
      if (sub.submissionNumber === 0) {
        const results$ = this.submissionService.postSubmission(sub);
        await lastValueFrom(results$).then(async submission => {
          sub.submissionNumber = submission.submissionNumber;
          sub.markClean();
          this.notification.show('Submission successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
          if (sub.submissionNumber !== null) {
            this.router.navigate(['/submission/' + sub.submissionNumber?.toString() + '/information']);
          }
          return true;
        },
        (error) => {
          this.notification.show('Submission Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open('Submission Save Error', errorMessage);
          return false;
        });
      } else {
        const results$ = this.submissionService.updateSubmission(sub);
        await lastValueFrom(results$).then(async (result) => {
          sub.updateClass(result);
          sub.markClean();
          this.notification.show('Submission successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
          return true;
        },
        (error) => {
          this.notification.show('Submission Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open('Submission Save Error', errorMessage);
          return false;
        });
      }
    } else {
      sub.showErrorMessage();
      window.scroll(0, 0);
    }
    this.showBusy = false;
  }

  navigateToHistoricRoute(route: HistoricRoute){
    this.router.navigate([route.url]);
  }

  async preSaveInsured(): Promise<void> {
    let insured: InsuredClass;
    if (this.pageDataService.insuredData == null) {
      return;
    } else {
      insured = this.pageDataService.insuredData;
    }
    if (insured.isValid) {
      let save: boolean | null = true;
      if (insured.isNew && insured.isValid) {
        save = await this.checkDuplicates(insured);
      }
      if (save) {
        this.showBusy = true;
        await this.saveInsured(insured);
      }
      this.showBusy = false;
    }
    else {
      insured.showErrorMessage();
      window.scroll(0, 0);
    }
  }
  private async checkDuplicates(insured: InsuredClass): Promise<boolean | null> {
    const dupe = newInsuredDupeRequst(insured);
    const results$ = this.insuredService.checkDuplicates(dupe);
    const results = await lastValueFrom(results$);

    if (results.length > 0) {
      if (this.dupeComponent != null) {
        return await this.dupeComponent.open(insured, results);
      }
    }
    return true;
  }

  async saveInsured(insured: InsuredClass): Promise<boolean> {
    if (insured.isValid) {
      if (insured.isNew) {
        this.isBusy = true;
        const results$ = this.insuredService.addInsured(insured);
        return await lastValueFrom(results$)
          .then(async result => {
            insured.isNew = false;
            this.notification.show('Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
            this.showBusy = false;
            insured.markClean();
            this.router.navigate(['/insured/' + result.insuredCode?.toString() + '/information']);
            this.isBusy = false;
            return true;
          },
          (error) => {
            this.isBusy = false;
            this.notification.show('Insured Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
            const errorMessage = error.error?.Message ?? error.message;
            this.messageDialogService.open('Insured Save Error', errorMessage);
            return false;
          });
      }
      else {
        if (insured.isDirty) {
          this.isBusy = true;
          const results$ = this.insuredService.updateInsured(insured);
          return await lastValueFrom(results$)
            .then(async updated => {
              insured.updateClass(updated);
              insured.markClean();
              this.notification.show('Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
              this.isBusy = false;
              return true;
            },
            (error) => {
              this.isBusy = false;
              this.notification.show('Insured Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
              const errorMessage = error.error?.Message ?? error.message;
              this.messageDialogService.open('Insured Save Error', errorMessage);
              return false;
            });
        }
        return true;
      }
    }
    return false;
  }
}
