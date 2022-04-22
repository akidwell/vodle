import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Insured } from '../../models/insured';

@Component({
  selector: 'rsps-insured-account',
  templateUrl: './insured-account.component.html',
  styleUrls: ['./insured-account.component.css']
})
export class InsuredAccountComponent implements OnInit {
  accountCollapsed = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  isReadOnly: boolean = false;
  states$: Observable<Code[]> | undefined;
  countries$: Observable<Code[]> | undefined;
  entityType$: Observable<Code[]> | undefined;
  sicCodes$: Observable<Code[]> | undefined;
  naicsCodes$: Observable<Code[]> | undefined;

  @Input() public insured!: Insured;
  
  constructor(private dropdowns: DropDownsService) { }

  ngOnInit(): void {
    this.states$ = this.dropdowns.getStates();
    this.countries$ = this.dropdowns.getCountries();
    this.entityType$ = this.dropdowns.getEntityType();
  }

  verify() {

  }
}
