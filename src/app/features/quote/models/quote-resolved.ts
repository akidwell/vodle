import { DepartmentClass } from '../classes/department-class';

export interface QuoteResolved {
    department: DepartmentClass | null;
    error?: any;
  }
