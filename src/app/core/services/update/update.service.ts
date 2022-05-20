import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigService } from '../config/config.service';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { MessageDialogService } from '../message-dialog/message-dialog-service';

@Injectable()
export class UpdateService {

  constructor(private updates: SwUpdate, private confirmationDialogService: ConfirmationDialogService, private messageDialogServive: MessageDialogService, private configService: ConfigService) { }

  startTimer() {
    console.log('Enable UpdateService: ' + environment.production);
    if (environment.production) {
      const updateInterval$ = interval(this.configService.updateTimerSecs * 1000);
      updateInterval$.subscribe(() => {
        this.updates.checkForUpdate().then(() => console.log('checking for updates'));
      });
    }
  }

  startLogging() {
    if (environment.production) {
      this.updates.versionUpdates.subscribe(evt => {
        console.log(evt.type);
        switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
        }
      });
    }
  }

  startConfirmation() {
    if (environment.production) {
      this.updates.versionUpdates.subscribe(async event => {
        if (event.type == 'VERSION_READY' && await this.confirmationDialogService.open('New Version Available', 'Update?')) {
          this.updates.activateUpdate().then(() => document.location.reload());
        }
      });
    }
  }

  startUnrecoverableStateCheck() {
    if (environment.production) {
      this.updates.unrecoverable.subscribe(event => {
        this.messageDialogServive.open('Error', 'An error occurred that we cannot recover from:\n' +
          event.reason +
          '\n\nPlease reload the page.');
      });
    }
  }
}