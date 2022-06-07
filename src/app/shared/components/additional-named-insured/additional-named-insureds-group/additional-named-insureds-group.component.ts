import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { AdditionalNamedInsured } from '../additional-named-insured';
import { SharedAdditionalNamedInsuredsComponent } from '../additional-named-insureds/additional-named-insureds.component';

@Component({
  selector: 'rsps-shared-additional-named-insureds-group',
  templateUrl: './additional-named-insureds-group.component.html',
  styleUrls: ['./additional-named-insureds-group.component.css']
})
export class SharedAdditionalNamedInsuredsGroupComponent implements OnInit {
  invalidMessage = '';
  showInvalid = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  aniCollapsed = false;
  color: ThemePalette = 'warn';
  canDrag = false;
  dragDropClass = '';

  @ViewChild(SharedAdditionalNamedInsuredsComponent) aniComp!: SharedAdditionalNamedInsuredsComponent;
  @ViewChildren(SharedAdditionalNamedInsuredsComponent) components: QueryList<SharedAdditionalNamedInsuredsComponent> | undefined;
  @Input() public aniData!: AdditionalNamedInsured[];
  @Input() public newANI!: AdditionalNamedInsured;
  @Input() public canEdit = false;

  constructor(private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.aniCollapsed = false;
  }

  isValid(): boolean {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.aniForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.aniForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }
  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyExistingAni(existingAni: AdditionalNamedInsured) {
    const copyAni = existingAni.clone();
    copyAni.name = 'CopyOf ' + existingAni.name;
    copyAni.sequenceNo = this.getNextSequence();
    this.aniData.push(copyAni);
  }

  deleteExistingAni(existingAni: AdditionalNamedInsured) {
    const index = this.aniData.indexOf(existingAni, 0);
    if (index > -1) {
      this.aniData.splice(index, 1);
      if (!existingAni.isNew) {
        this.notification.show('Additional Named Insureds deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }
  getNextSequence(): number {
    if (this.aniData.length == 0) {
      return 1;
    }
    else {
      return Math.max(...this.aniData.map(o => o.sequenceNo)) + 1;
    }
  }

  addNewAdditionalNamedInsured(): void {
    const clone = this.newANI.clone();
    clone.sequenceNo = this.getNextSequence();
    this.aniData.push(clone);
  }

  async saveAdditionalNamedInsureds(): Promise<boolean> {
    if (this.canEdit && this.isDirty()) {
      let saveCount = 0;
      if (this.components != null) {
        for (const child of this.components) {
          if (child.aniForm.dirty) {
            const result = await child.save();
            if (result === false) {
              this.notification.show('Additional Named Insured ' + child.aniData.name + ' not saved.', { classname: 'bg-danger text-light', delay: 5000 });
            }
            else {
              saveCount++;
            }
          }
        }
        if (saveCount > 0) {
          this.notification.show('Additional Named Insured successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        }
      }
      if (!this.isValid()) {
        this.notification.show('Additional Named Insureds not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }
    }
    return false;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.aniData, event.previousIndex, event.currentIndex);
    }
    let sequence = 1;
    this.aniData.forEach(c => {
      if (c.sequenceNo != sequence) {
        const match = this.components?.find(l => l.aniData.sequenceNo == c.sequenceNo);
        match?.aniForm.form.markAsDirty();
        c.sequenceNo = sequence;
      }
      sequence++;
    });
  }

  toggleDragDrop() {
    // Collapse all locations
    if (this.canDrag) {
      this.dragDropClass = 'drag';
    }
    else {
      this.dragDropClass = '';
    }
  }

}
