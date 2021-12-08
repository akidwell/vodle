import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Endorsement } from '../../policy';

@Component({
  selector: 'rsps-policy-layer-header',
  templateUrl: './policy-layer-header.component.html',
  styleUrls: ['./policy-layer-header.component.css']
})
export class PolicyLayerHeaderComponent implements OnInit {
  endorsement!: Endorsement;
  isReadOnly: boolean = true;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  canEditTransactionType: boolean = false;
  reinsuranceLayerNo!: number;
  updateSub!: Subscription;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsement = data['endorsementData'].endorsement;
    });
  }
}