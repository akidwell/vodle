import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EndorsementCoveragesGroup } from './coverages';

@Component({
  selector: 'rsps-coverages',
  templateUrl: './coverages.component.html',
  styleUrls: ['./coverages.component.css']
})
export class CoveragesComponent implements OnInit {
  endorsementCoveragesGroups! : EndorsementCoveragesGroup[];
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
    });
  }

  };
