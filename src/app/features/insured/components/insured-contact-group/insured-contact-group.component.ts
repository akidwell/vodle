import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
export class InsuredContactGroupComponent {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  contactsCollapsed = false;
  endorsementNumber!: number;
  authSub!: Subscription;
  canEditInsured = false;
  canEditEndorsement = false;

  @Input() public insuredContacts: InsuredContact[] = [];
  @ViewChildren(InsuredContactComponent) components: QueryList<InsuredContactComponent> | undefined;
  @ViewChild(NgForm, { static: false }) contactForm!: NgForm;

  constructor(private userAuth: UserAuth, private notification: NotificationService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  addNewContact(): void {
    const newContact = newInsuredContact();
    if (this.insuredContacts.length == 0) {
      newContact.isPrimary = true;
    }
    this.insuredContacts.push(newContact);
  }

  copyExistingContact(contact: InsuredContact) {
    const newContact: InsuredContact = deepClone(contact);
    newContact.insuredContactId = null;
    newContact.isNew = true;
    newContact.isPrimary = false;
    newContact.isPrimaryTracked = false;
    newContact.firstName = 'CopyOf ' + newContact.firstName;
    this.insuredContacts.push(newContact);
  }

  setPrimaryContact() {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.contact.isPrimary) {
          child.contactForm.form.markAsDirty();
          child.contact.isPrimary = false;
        }
      }
    }
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
    if (this.hasDuplicates()) {
      return false;
    }
    if (this.components != null) {
      for (const child of this.components) {
        if (child.contactForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.contactForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }

  hasDuplicates(): boolean {
    let dupe = false;
    this.insuredContacts.forEach(x => {
      if (!dupe) {
        dupe = this.insuredContacts.filter(c => c.firstName == x.firstName && c.lastName == x.lastName && c.email == x.email && c.phone == x.phone && c.fax == x.fax).length > 1;
      }
    });
    return dupe;
  }

  getDuplicateName(): string {
    let dupe = false;
    let dupeName = '';

    this.insuredContacts.forEach(x => {
      if (!dupe) {
        dupe = this.insuredContacts.filter(c => c.firstName == x.firstName).length > 1;
        if (dupe) {
          dupeName = (x.firstName + ' ' + x.lastName).trim();
        }
      }
    });
    return dupeName;
  }
}
