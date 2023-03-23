import { DatePipe } from '@angular/common';
import { compileDeclareClassMetadata } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Code } from 'src/app/core/models/code';
import { DepartmentProgram } from 'src/app/core/models/department-program';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { AdvancedSearchClass } from 'src/app/shared/classes/advanced-search-class';

@Component({
  selector: 'rsps-advanced-search-menu',
  templateUrl: './advanced-search-menu.component.html',
  styleUrls: ['./advanced-search-menu.component.css']
})
export class AdvancedSearchMenuComponent {
  @Input() public advancedSearchClass: AdvancedSearchClass = new AdvancedSearchClass();
  @Input() public collapsed = true;
  @Input() public search!:() => void;

  _renewalStatuses: Code[] = [];
  departments$: Observable<Code[]> | undefined;
  submissionStatuses$: Observable<Code[]> | undefined;
  underwriters$: Observable<Code[]> | undefined;
  _departmentList: DepartmentProgram[]  | undefined;
  _programs: Code[] = [];
  _filteredPrograms: Code[] = [];
  constructor(private dropdowns: DropDownsService, private datePipe: DatePipe){

  }

  ngOnInit(){
    this.departments$ = this.dropdowns.getDepartments(null);
    this.submissionStatuses$ = this.dropdowns.getSubmissionStatuses();
    this.underwriters$ = this.dropdowns.getUnderwriters();
    this.dropdowns.getPrograms().subscribe((test) => this._programs = test);
    this.dropdowns.getProgramDepartmentMapForDropdown().subscribe((test) => this._departmentList = test);

    this._renewalStatuses.push({
      key: 0, 
      description: 'N',
      code: ''
    });
    this._renewalStatuses.push({
      key: 1, 
      description: 'R',
      code: ''
    });
  }

  departmentChange()
  {
    this._filteredPrograms = [];
    this.advancedSearchClass.programID = 0;
    
    var filteredDepartments = this._departmentList?.filter((department) => department.intDepartmentCode == this.advancedSearchClass.departmentCode);

    filteredDepartments?.forEach((dept) =>
    {
      var program = this._programs.find((pgm) => dept.intProgramId == pgm.key);
      if(program != undefined)
        this._filteredPrograms.push(program);
    })
  }
  
}
