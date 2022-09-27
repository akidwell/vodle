import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { PolicyFormsService } from '../services/policy-forms.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'rsps-policy-form-variable',
  templateUrl: './policy-form-variable.component.html',
  styleUrls: ['./policy-form-variable.component.css']
})
export class PolicyFormVariableComponent {
  private modalRef!: NgbModalRef;
  formName!: string;
  formHTML: string | SafeHtml = '';
  hasGuideline = false;

  @Input() canEdit = false;
  @ViewChild('modal') private modalContent!: TemplateRef<PolicyFormVariableComponent>;

  constructor(private modalService: NgbModal, private policyFormsService: PolicyFormsService, private sanitizer: DomSanitizer) { }

  async open(formName: string): Promise<boolean> {
    this.formName = formName;

    await this.checkGuideline(formName);
    await this.populateHTML(formName);

    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { scrollable: true, backdrop: 'static', size: 'xl' });
      this.modalRef.result.then(resolve, resolve);
      return true;
    });
  }

  private async checkGuideline(formName: string) {
    const response$ = this.policyFormsService.hasGuideline(formName);
    await lastValueFrom(response$)
      .then(guideline => {
        this.hasGuideline = guideline;
      });
  }

  private async populateHTML(formName: string) {
    const response$ = this.policyFormsService.getVariableHTML(formName);
    await lastValueFrom(response$)
      .then(guideline => {
        if (guideline) {
          new Blob([guideline], { type: 'application/html', }).text().then(c => this.formHTML = this.sanitizer.bypassSecurityTrustHtml(c));
        }
      });
  }

  save() {
    // TODO
    // console.log( this.formHTML.toString().indexOf('<label for="Percentage">'));
  }

  cancel() {
    this.modalRef.close(false);
  }

  async showGuideline() {
    const response$ = this.policyFormsService.getGuideline(this.formName);
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
