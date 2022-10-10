import { Component, Input } from '@angular/core';

@Component({
  selector: 'rsps-busy',
  templateUrl: './busy.component.html',
  styleUrls: ['./busy.component.css']
})

export class BusyComponent {
  @Input() message: string | null = null;

}
