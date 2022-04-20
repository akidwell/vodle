import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[endorsement-coverage-directive]',
})
export class EndorsementCoverageDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}