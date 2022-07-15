import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepartmentClass } from '../../../classes/department-class';

@Component({
  selector: 'rsps-quote-premium',
  templateUrl: './quote-premium.component.html',
  styleUrls: ['./quote-premium.component.css']
})
export class QuotePremiumComponent implements OnInit {
  department!: DepartmentClass;



  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.department = data['quoteData'].department;
    });
  }

}


