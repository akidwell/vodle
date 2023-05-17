import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { PolicyV2Component } from '../components/policy-base/policy-v2.component';
import { PolicyInformationV2Component } from '../components/common/policy-information-v2/policy-information-v2.component';
import { PolicyReinsuranceComponent } from '../components/common/policy-reinsurance/policy-reinsurance.component';
import { PolicySummaryComponent } from '../components/common/policy-summary/policy-summary.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigationConfirmationService } from 'src/app/core/services/navigation-confirmation/navigation-confirmation.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { QuoteProgramBaseComponent } from '../../quote/components/quote-program-base/quote-program-base.component';
import { PolicyPremiumComponent } from '../components/property/policy-premium/policy-premium.component';
import { PolicyPropertyLocationCoverageComponent } from '../components/property/policy-property-location-coverage/policy-property-location-coverage.component';
import { PolicyPropertyMortgageeComponent } from '../components/property/policy-property-mortgagee/policy-property-mortgagee.component';
import { PolicySavingService } from '../services/policy-saving-service/policy-saving.service';
import { PolicyValidationService } from '../services/policy-validation-service/policy-validation.service';

@Injectable()
export class CanDeactivateGuard
{}
