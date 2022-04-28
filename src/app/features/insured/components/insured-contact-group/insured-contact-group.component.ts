import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { InsuredContactComponent } from '../insured-contact/insured-contact.component';
import { InsuredContact, newInsuredContact } from '../../models/insured-contact';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'rsps-insured-contact-group',
  templateUrl: './insured-contact-group.component.html',
  styleUrls: ['./insured-contact-group.component.css']
})
export class InsuredContactGroupComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  contactsCollapsed: boolean = false;
  endorsementNumber!: number;
  authSub!: Subscription;
  canEditInsured: boolean = false;
  canEditEndorsement: boolean = false;

  @Input() public insuredContacts: InsuredContact[] = [];
  @ViewChildren(InsuredContactComponent) components: QueryList<InsuredContactComponent> | undefined;
  @ViewChild(NgForm, { static: false }) contactForm!: NgForm;

  constructor(private userAuth: UserAuth, private notification: NotificationService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  addNewEndorsementLocation(): void {
    let newLocation = newInsuredContact();
    this.insuredContacts.push(newLocation);
  }

  copyExistingContact(contact: InsuredContact) {
    const newContact: InsuredContact = deepClone(contact);
    newContact.isNew = true;
    newContact.isPrimary = false;
    this.insuredContacts.push(newContact);
  }

  primaryContact(contact: InsuredContact) {

    if (this.components != null) {
      for (let child of this.components) {
        if (child.contact.isPrimary) {
          child.contactForm.form.markAsDirty();
          child.contact.isPrimary = false;
        }
      }
    }

    // this.insuredContacts.forEach(contact => {
    //   if (contact.isPrimary) {
    //     this.contactForm.form.markAsDirty();
    //     contact.isPrimary = false;
    //   }
    // });
    // this.contactForm.form.markAsDirty();
    // contact.isPrimary = true;

  }

  deleteContact(contact: InsuredContact) {
    const index = this.insuredContacts.indexOf(contact, 0);
    if (index > -1) {
      this.insuredContacts.splice(index, 1);
      if (!contact.isNew) {
        this.notification.show('Contact deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  isValid(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.contactForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.contactForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }

  async save(): Promise<boolean> {
    if (this.canEditInsured && this.isDirty()) {
      let saveCount: number = 0;
      if (this.components != null) {
        for (let child of this.components) {
          if (child.contactForm.dirty) {
            let result = await child.save();
            if (result === false) {
              this.notification.show('Contacts ' + child.contact.firstName.toString() + ' not saved.', { classname: 'bg-danger text-light', delay: 5000 });
            }
            else {
              saveCount++;
            }
          }
        }
        if (saveCount > 0) {
          this.notification.show('Contact successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        }
      }
      if (!this.isValid()) {
        this.notification.show('Contact not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }
    }
    return false;
  }

}
