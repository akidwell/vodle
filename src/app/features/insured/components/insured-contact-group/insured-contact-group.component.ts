import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { InsuredContactComponent } from '../insured-contact/insured-contact.component';
import { NgForm } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { InsuredContactClass } from '../../classes/insured-contact-class';

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
  color: ThemePalette = 'warn';
  canDrag = false;
  dragDropClass = '';

  @Input() public insuredContacts: InsuredContactClass[] = [];
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
    // const newContact = newInsuredContact();
    const newContact = new InsuredContactClass();
    newContact.sequence = this.getNextSequence();
    if (this.insuredContacts.length == 0) {
      newContact.isPrimary = true;
    }
    this.insuredContacts.push(newContact);
  }

  copyExistingContact(contact: InsuredContactClass) {
    const newContact: InsuredContactClass = Object.create(contact);
    newContact.insuredContactId = null;
    newContact.sequence = this.getNextSequence();
    newContact.isNew = true;
    newContact.isPrimary = false;
    newContact.isPrimaryTracked = false;
    newContact.firstName = 'CopyOf ' + newContact.firstName;
    newContact.markDirty();
    this.insuredContacts.push(newContact);
  }

  setPrimaryContact() {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.contact.isPrimary) {
          child.contact.isPrimary = false;
        }
      }
    }
  }

  deleteContact(contact: InsuredContactClass) {
    const index = this.insuredContacts.indexOf(contact, 0);
    if (index > -1) {
      this.insuredContacts.splice(index, 1);
      if (!contact.isNew) {
        this.notification.show('Contact deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  // isValid(): boolean {
  //   if (this.hasDuplicates()) {
  //     return false;
  //   }
  //   if (this.components != null) {
  //     for (const child of this.components) {
  //       if (child.contactForm.status != 'VALID') {
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // }

  // isDirty() {
  //   if (this.components != null) {
  //     for (const child of this.components) {
  //       if (child.contactForm.dirty) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  // hasDuplicates(): boolean {
  //   let dupe = false;
  //   this.insuredContacts.forEach(x => {
  //     if (!dupe) {
  //       dupe = this.insuredContacts.filter(c => c.firstName == x.firstName && c.lastName == x.lastName && c.email == x.email && c.phone == x.phone && c.fax == x.fax).length > 1;
  //     }
  //   });
  //   return dupe;
  // }

  // getDuplicateName(): string {
  //   let dupe = false;
  //   let dupeName = '';

  //   this.insuredContacts.forEach(x => {
  //     if (!dupe) {
  //       dupe = this.insuredContacts.filter(c => c.firstName == x.firstName).length > 1;
  //       if (dupe) {
  //         dupeName = (x.firstName + ' ' + x.lastName).trim();
  //       }
  //     }
  //   });
  //   return dupeName;
  // }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.insuredContacts, event.previousIndex, event.currentIndex);
    }
    let sequence = 1;
    this.insuredContacts.forEach(c => {
      if (c.sequence != sequence) {
        const match = this.components?.find(l => l.contact.sequence == c.sequence);
        c.sequence = sequence;
      }
      sequence++;
    });
  }

  getNextSequence(): number {
    if (this.insuredContacts.length == 0) {
      return 1;
    }
    else {
      return Math.max(...this.insuredContacts.map(o => o.sequence ?? 0)) + 1;
    }
  }

  toggleDragDrop() {
    this.contactsCollapsed = false;
    if (this.canDrag) {
      this.dragDropClass = 'drag';
    }
    else {
      this.dragDropClass = '';
    }
  }
}
