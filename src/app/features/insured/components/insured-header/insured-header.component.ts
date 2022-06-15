import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Insured } from '../../models/insured';

@Component({
  selector: 'rsps-insured-header',
  templateUrl: './insured-header.component.html',
  styleUrls: ['./insured-header.component.css']
})
export class InsuredHeaderComponent {

  @Input() public insured!: Insured;
  constructor(private route: ActivatedRoute) {

  }

}
