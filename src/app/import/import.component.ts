import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportPolicy } from './import-policy';
import { ImportService } from './import.service';

@Component({
  selector: 'rsps-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  errorMessage = '';
  sub!: Subscription;
  importPolicies: ImportPolicy[] = []
    
  constructor(private importService: ImportService) {}

 ngOnInit(): void {
    this.sub = this.importService.getImportPolicies().subscribe({
      next: importPolicies => {
        this.importPolicies = importPolicies;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


}
