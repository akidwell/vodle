import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Policy } from '../policy';

@Component({
  selector: 'rsps-policy-header',
  templateUrl: './policy-header.component.html',
  styleUrls: ['./policy-header.component.css']
})
export class PolicyHeaderComponent implements OnInit {
  policy!: Policy;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.policy = data['resolvedData'].policy;
    });
  }

}
