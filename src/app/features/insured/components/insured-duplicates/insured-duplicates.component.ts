import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';import { Insured } from '../../models/insured';
import { InsuredDupeResponse } from '../../models/insured-dupe-response';

@Component({
  selector: 'rsps-insured-duplicates',
  templateUrl: './insured-duplicates.component.html',
  styleUrls: ['./insured-duplicates.component.css']
})
export class InsuredDuplicatesComponent {
  source!: Insured;
  searchResults: InsuredDupeResponse[] = [];

  private modalRef!: NgbModalRef;
  @ViewChild('modal') private modalContent!: TemplateRef<InsuredDuplicatesComponent>;

  constructor(private modalService: NgbModal, private router: Router, private navigationService: NavigationService) { }

  open(source: Insured, data: InsuredDupeResponse[]): Promise<boolean> {
    this.source = source;
    this.searchResults = data;
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { scrollable: true, backdrop: 'static', size: 'xl' });
      this.modalRef.result.then(resolve, resolve);
      return true;
    });
  }

  save() {
    this.modalRef.close(true);
  }

  cancel() {
    this.modalRef.close(false);
  }

  routeToInsured(insuredCode: number) {
    this.modalRef.close(null);
    this.navigationService.clearReuse();
    this.router.navigate(['/insured/' + insuredCode.toString() + '/information']);
  }

}