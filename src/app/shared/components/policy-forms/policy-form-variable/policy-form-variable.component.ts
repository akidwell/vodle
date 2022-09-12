import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { SpecimenPacketService } from '../services/specimen-packet.service';

@Component({
  selector: 'rsps-policy-form-variable',
  templateUrl: './policy-form-variable.component.html',
  styleUrls: ['./policy-form-variable.component.css']
})
export class PolicyFormVariableComponent implements OnInit {
  private modalRef!: NgbModalRef;
  formName!: string;

  @Input() canEdit = false;
  @ViewChild('modal') private modalContent!: TemplateRef<PolicyFormVariableComponent>;

  constructor(private modalService: NgbModal, private specimenPacketService: SpecimenPacketService) { }

  ngOnInit(): void {
  }

  async open(formName: string): Promise<boolean> {
    this.formName = formName;
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { scrollable: true, backdrop: 'static', size: 'xl' });
      this.modalRef.result.then(resolve, resolve);
      return true;
    });
  }

  save() {
    // TODO
  }

  cancel() {
    this.modalRef.close(false);
  }

  async showGuideline() {
    const response$ = this.specimenPacketService.getGuideline(this.formName);
    await lastValueFrom(response$)
      .then(guideline => {
        if (guideline) {
          const file = new Blob([guideline], { type: 'application/pdf', });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      });
  }
}
