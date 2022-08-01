import { SicCode } from './sic-code';

export interface ClassCode{

classCode: string;
description: string;
exposureBasisCode: [];
sicCode: SicCode[];
effectiveDate: Date;
expirationDate: Date;
}