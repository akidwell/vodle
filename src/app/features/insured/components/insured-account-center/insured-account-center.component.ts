import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Insured } from '../../models/insured';

@Component({
  selector: 'rsps-insured-account-center',
  templateUrl: './insured-account-center.component.html',
  styleUrls: ['./insured-account-center.component.css']
})
export class InsuredAccountCenterComponent implements OnInit {
  canEditInsured: boolean = false;
  authSub: Subscription;
  
  @Input() public insured!: Insured;
  @ViewChild(NgForm, { static: false }) centerPanel!: NgForm;
  
  constructor(private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {
  }

}
