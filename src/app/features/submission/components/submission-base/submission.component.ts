import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';

@Component({
  selector: 'rsps-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['../../../../app.component.css', './submission.component.css']
})
export class SubmissionComponent implements OnInit {

  constructor(private router: Router, private config: ConfigService, public headerPaddingService: HeaderPaddingService) {
  }

  ngOnInit(): void {
    //If the policy module is loaded and the user is not trying to access policy information we need to redirect them to policy information
    if (this.router.url.split('/').slice(-1)[0] != 'information' && !this.config.preventForcedRedirect) {
      this.doRedirect();
    }
  }

  doRedirect() {
    const urlString = this.router.url.split('/').slice(0, -1).join('/') + '/information';
    setTimeout(() => {
      this.router.navigate([urlString], { state: { bypassFormGuard: true } });
    });
  }

}
