import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ChildBaseClass } from './base/child-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { ActivatedRoute } from '@angular/router';

export class ReinsuranceClass extends ChildBaseClass implements Deletable {

    constructor(private route: ActivatedRoute) {
        super()
    }

    private _markForDeletion = false;
    get markForDeletion() : boolean {
        return this._markForDeletion;
    }
    set markForDeletion(value: boolean) {
        this._markForDeletion = value;
        this.markDirty();
    }

    onDelete(): void {
        throw new Error('Method not implemented.');
    }
    
    validate(): ErrorMessage[] {
        throw new Error('Method not implemented.');
    }
    onGuidNewMatch(T: ChildBaseClass): void {
        throw new Error('Method not implemented.');
    }
    onGuidUpdateMatch(T: ChildBaseClass): void {
        throw new Error('Method not implemented.');
    }

}