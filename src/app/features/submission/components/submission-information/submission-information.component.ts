import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { Submission } from '../../models/submission';
import { SubmissionService } from '../../services/submission-service/submission-service';


@Component({
  selector: 'rsps-submission-information',
  templateUrl: './submission-information.component.html',
  styleUrls: ['./submission-information.component.css']
})
export class SubmissionInformationComponent implements OnInit {
  submission!: Submission;
  canEditSubmission = false;
  authSub: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  showInvalid = false;
  invalidMessage = '';
  showBusy = false;

  constructor(private route: ActivatedRoute, private router: Router, private submissionService: SubmissionService, private userAuth: UserAuth, private messageDialogService: MessageDialogService, private notification: NotificationService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
    // this.newInsuredANI = new insuredANI(this.submissionService);
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.submission = data['submissionData'].submission;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.addSub?.unsubscribe();
    this.updateSub?.unsubscribe();
  }

  isValid(): boolean {
    if (!this.canEditSubmission) {
      return true;
    }
    return true;
  }

  private adddressValid() {
    return true;
  }

  isDirty(): boolean {
    return false;
    // return this.canEditSubmission && (this.accountInfoComp?.isDirty() || this.contactComp?.isDirty() || this.aniComp?.isDirty());
  }

  async save(): Promise<void> {
    // this.showBusy = true;
    // const refresh = this.insured.isNew;
    // await this.saveInsured();
    // this.showBusy = false;
    // if (refresh && this.insured.insuredCode !== null) {
    //   this.router.navigate(['/insured/' + this.insured.insuredCode?.toString() + '/information']);
    // }
    console.log('save');
  }

  async saveSubmission(): Promise<boolean> {
    console.log(this.submission);
    return true;
    // if (this.isValid()) {
    //   this.hideInvalid();
    //   // if (this.insured.isNew) {
    //   //   const results$ = this.insuredService.addInsured(this.insured);
    //   //   return await lastValueFrom(results$)
    //   //     .then(async insured => {
    //   //       this.insured = insured;
    //   //       this.insured.isNew = false;
    //   //       this.markClean();
    //   //       this.notification.show('Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
    //   //       return true;
    //   //     },
    //   //       (error) => {
    //   //         this.notification.show('Insured Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
    //   //         const errorMessage = error.error?.Message ?? error.message;
    //   //         this.messageDialogService.open("Insured Save Error", errorMessage);
    //   //         return false;
    //   //       });
    //   // }
    //   // else {
    //   if (this.isDirty()) {
    //     const results$ = this.insuredService.updateInsured(this.insured);
    //     return await lastValueFrom(results$)
    //       .then(async insured => {
    //         this.insured = insured;
    //         this.insured.isNew = false;
    //         this.markClean();

    //         this.notification.show('Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
    //         return true;
    //       },
    //       (error) => {
    //         this.notification.show('Insured Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
    //         const errorMessage = error.error?.Message ?? error.message;
    //         this.messageDialogService.open('Insured Save Error', errorMessage);
    //         return false;
    //       });
    //   }
    //   return true;
    //   //}
    // }
    // else {
    //   this.showInvalidControls();
    //   window.scroll(0,0);
    // }
    // return false;
  }

  private markClean() {
    // this.accountInfoComp.markClean();

    // if (this.aniComp.components != null) {
    //   for (const child of this.aniComp.components) {
    //     child.aniForm.form.markAsPristine();
    //     child.aniForm.form.markAsUntouched();
    //   }
    // }
    // if (this.contactComp.components != null) {
    //   for (const child of this.contactComp.components) {
    //     child.contactForm.form.markAsPristine();
    //     child.contactForm.form.markAsUntouched();
    //   }
    // }

  }


  showInvalidControls(): void {
    const invalid = [];

    // // Check each control in account information component if it is valid
    // const accountControls = this.accountInfoComp.accountInfoForm.controls;
    // for (const name in accountControls) {
    //   if (accountControls[name].invalid) {
    //     invalid.push(name);
    //   }
    // }

    // // Loop through each child component to see it any of them have invalid controls
    // if (this.aniComp.components != null) {
    //   for (const child of this.aniComp.components) {
    //     for (const name in child.aniForm.controls) {
    //       if (child.aniForm.controls[name].invalid) {
    //         invalid.push(name + ' - ANI: #' + child.aniData.sequenceNo.toString());
    //       }
    //     }
    //   }
    // }
    // if (this.contactComp.components != null) {
    //   for (const child of this.contactComp.components) {
    //     for (const name in child.contactForm.controls) {
    //       if (child.contactForm.controls[name].invalid) {
    //         invalid.push(name + ' - Contact: #' + (child.index + 1));
    //       }
    //     }
    //   }
    // }

    // if (this.contactComp.hasDuplicates()) {
    //   const name = this.contactComp.getDuplicateName();
    //   invalid.push('Contact ' + name + ' is a duplicated');
    // }
    if (!this.adddressValid()) {
      invalid.push('Address not Verified');
    }

    this.invalidMessage = '';
    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (const error of invalid) {
        this.invalidMessage += '<br><li>' + error;
      }
    }

    if (this.showInvalid) {
      this.invalidMessage = 'Following fields are invalid' + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }


}
