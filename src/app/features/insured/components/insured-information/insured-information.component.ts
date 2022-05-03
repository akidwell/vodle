import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { SharedAdditionalNamedInsuredsGroupComponent } from 'src/app/shared/components/additional-named-insured/additional-named-insureds-group/additional-named-insureds-group.component';
import { Insured } from '../../models/insured';
import { InsuredContact } from '../../models/insured-contact';
import { InsuredService } from '../../services/insured-service/insured.service';
import { InsuredAccountComponent } from '../insured-account/insured-account.component';
import { InsuredContactGroupComponent } from '../insured-contact-group/insured-contact-group.component';

@Component({
  selector: 'rsps-insured-information',
  templateUrl: './insured-information.component.html',
  styleUrls: ['./insured-information.component.css']
})
export class InsuredInformationComponent implements OnInit {
  insured!: Insured;
  contacts: InsuredContact[] = [];
  aniInsuredData: insuredANI[] = [];
  canEditInsured: boolean = false;
  newInsuredANI!: insuredANI;
  authSub: Subscription;
  addSub!: Subscription;
  updateSub!: Subscription;
  showInvalid: boolean = false;
  invalidMessage: string = "";
  showBusy: boolean = false;

  @ViewChild(SharedAdditionalNamedInsuredsGroupComponent) aniComp!: SharedAdditionalNamedInsuredsGroupComponent;
  @ViewChild(InsuredAccountComponent) accountInfoComp!: InsuredAccountComponent;
  @ViewChild(InsuredContactGroupComponent) contactComp!: InsuredContactGroupComponent;

  constructor(private route: ActivatedRoute, private router: Router, private insuredService: InsuredService, private userAuth: UserAuth, private messageDialogService: MessageDialogService, private notification: NotificationService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
    this.newInsuredANI = new insuredANI(this.insuredService);
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.insured = data['insuredData'].insured;
      // this.aniInsuredData = data['aniData'].additionalNamedInsureds;
      // this.contacts = data['contacts'].insuredContacts;
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.addSub?.unsubscribe();
    this.updateSub?.unsubscribe();
  }

  isValid(): boolean {
    if (!this.canEditInsured) {
      return true;
    }
    return this.accountInfoComp.accountInfoForm.status == 'VALID' && this.contactComp.isValid() && this.aniComp.isValid() && this.adddressValid();
  }

  private adddressValid() {
    return this.insured.isAddressOverride || this.insured.addressVerifiedDate != null;
  }

  isInsuredDirty(): boolean {
    return this.canEditInsured && (this.accountInfoComp?.accountInfoForm?.dirty ?? false);
  }

  isDirty(): boolean {
    return this.canEditInsured && (this.isInsuredDirty() || this.contactComp?.isDirty() || this.aniComp?.isDirty());
  }

  async save(): Promise<void> {
    this.showBusy = true;

    const refresh = this.insured.isNew;
    await this.saveInsured();
      // this.contacts.forEach(c => c.insuredCode = this.insured.insuredCode!);
      // this.aniInsuredData.forEach(c => c.insuredCode = this.insured.insuredCode!);
      // await this.saveContacts();
      // await this.saveInsuredANI();
    this.showBusy = false;
    if (refresh && this.insured.insuredCode !== null) {
      this.router.navigate(['/insured/' + this.insured.insuredCode?.toString() + '/information']);
    }
  }

  async saveInsured(): Promise<boolean> {
    if (this.isValid()) {
      this.hideInvalid();
      if (this.insured.isNew) {
        const results$ = this.insuredService.addInsured(this.insured);
        return await lastValueFrom(results$)
          .then(async insured => {
            this.insured = insured;
            this.insured.isNew = false;
            this.markClean();
            this.notification.show('Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
            return true;
          },
            (error) => {
              this.notification.show('Insured Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
              const errorMessage = error.error?.Message ?? error.message;
              this.messageDialogService.open("Insured Save Error", errorMessage);
              return false;
            });
      }
      else {
        if (this.isDirty()) {
          const results$ = this.insuredService.updateInsured(this.insured);
          return await lastValueFrom(results$)
            .then(async insured => {
              this.insured = insured;
              this.insured.isNew = false;
              this.markClean();

              this.notification.show('Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
              return true;
            },
              (error) => {
                this.notification.show('Insured Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
                const errorMessage = error.error?.Message ?? error.message;
                this.messageDialogService.open("Insured Save Error", errorMessage);
                return false;
              });
        }
        return true;
      }
    }
    else {
      this.showInvalidControls()
    }
    return false;
  }

  // async saveContacts(): Promise<boolean> {
  //   return await this.contactComp.save();
  // }

  // async saveInsuredANI() {
  //   await this.aniComp?.saveAdditionalNamedInsureds();
  // }


  private markClean() {
    this.accountInfoComp.accountInfoForm.form.markAsPristine();
    this.accountInfoComp.accountInfoForm.form.markAsUntouched();

    if (this.aniComp.components != null) {
      for (let child of this.aniComp.components) {
        for (let name in child.aniForm.controls) {
          child.aniForm.form.markAsPristine();
          child.aniForm.form.markAsUntouched();
        }
      }
    }
    if (this.contactComp.components != null) {
      for (let child of this.contactComp.components) {
        for (let name in child.contactForm.controls) {
          child.contactForm.form.markAsPristine();
          child.contactForm.form.markAsUntouched();
        }
      }
    }

  }


  showInvalidControls(): void {
    let invalid = [];

    // Check each control in account information component if it is valid
    let accountControls = this.accountInfoComp.accountInfoForm.controls;
    for (let name in accountControls) {
      if (accountControls[name].invalid) {
        invalid.push(name);
      }
    }

    // Loop through each child component to see it any of them have invalid controls
    if (this.aniComp.components != null) {
      for (let child of this.aniComp.components) {
        for (let name in child.aniForm.controls) {
          if (child.aniForm.controls[name].invalid) {
            invalid.push(name + " - ANI: #" + child.aniData.sequenceNo.toString());
          }
        }
      }
    }
    if (this.contactComp.components != null) {
      for (let child of this.contactComp.components) {
        for (let name in child.contactForm.controls) {
          if (child.contactForm.controls[name].invalid) {
            invalid.push(name + " - Contact: #" + (child.index + 1));
          }
        }
      }
    }

    if (this.contactComp.hasDuplicates()) {
      const name = this.contactComp.getDuplicateName();
      invalid.push("Contact " + name + " is a duplicated");
    }
    if (!this.adddressValid()) {
      invalid.push("Address not Verified");
    }

    this.invalidMessage = "";
    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (let error of invalid) {
        this.invalidMessage += "<br><li>" + error;
      }
    }

    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }


}
