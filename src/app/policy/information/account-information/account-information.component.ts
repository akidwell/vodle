import { Component, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { AccountInformation } from '../../policy';

@Component({
  selector: 'rsps-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
  accountInfo!: AccountInformation;
  isReadOnly: boolean = true;
  accountCollapsed = false;
  faPlus = faAngleUp;
  faMinus = faAngleDown;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.accountInfo = data['accountData'].accountInfo;
      console.log(this.accountInfo);
    });
  }

}
