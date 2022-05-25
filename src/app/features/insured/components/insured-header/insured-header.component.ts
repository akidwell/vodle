import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Insured } from '../../models/insured';

@Component({
  selector: 'rsps-insured-header',
  templateUrl: './insured-header.component.html',
  styleUrls: ['./insured-header.component.css']
})
export class InsuredHeaderComponent implements OnInit {
  insured!: Insured;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.insured = data['insuredData'].insured;
    });
  }

}
