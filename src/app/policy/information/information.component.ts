import { Component, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'rsps-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  isReadOnly: boolean = true;
  accountCollapsed = false;
  faPlus = faAngleUp;
  faMinus = faAngleDown;

  constructor() { }

  ngOnInit(): void { }

}
