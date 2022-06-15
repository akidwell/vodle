import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InsuredClass } from '../../classes/insured-class';

@Component({
  selector: 'rsps-insured-header',
  templateUrl: './insured-header.component.html',
  styleUrls: ['./insured-header.component.css']
})

export class InsuredHeaderComponent {
  @Input() public insured!: InsuredClass;
  constructor(private route: ActivatedRoute) {

  }

}
