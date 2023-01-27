

import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { InsuredSearchResponses } from 'src/app/features/home/models/search-results';

export type SortColumn = keyof InsuredSearchResponses | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeaderDirective {
	@Input() sortable: SortColumn = '';
	@Input() direction: SortDirection = '';
	@Output() sort = new EventEmitter<SortEvent>();

	rotate() {
	  this.direction = rotate[this.direction];
	  this.sort.emit({ sortColumn: this.sortable, sortDirection: this.direction });
	}
}
