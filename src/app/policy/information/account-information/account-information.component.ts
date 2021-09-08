import { Component, OnInit } from '@angular/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Policy } from '../../policy';

@Component({
  selector: 'rsps-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
  policy!: Policy;
  isReadOnly: boolean = true;
  accountCollapsed = false;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policy = data['resolvedData'].policy;
    });
  }

}
