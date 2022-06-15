import { Params } from '@angular/router';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { InsuredContactClass } from '../classes/insured-contact-class';

export interface Insured {
    insuredCode: number | null,
    name: string | null,
    formerName1: string | null,
    formerName2: string | null,
    sicCode: string | null,
    naicsCode: string | null,
    entityType: number | null,
    street1: string | null,
    street2: string | null,
    city: string | null,
    state: string | null,
    zip: string | null,
    county: string | null,
    country: string | null,
    website: string | null,
    comments: string | null,
    customerCode: number | null,
    isAddressOverride: boolean,
    addressVerifiedDate: Date | null,
    fein: string | null,
    createdBy: string | null,
    createdDate: Date | null,
    modifiedBy: string | null,
    modifiedDate: Date | null,
    isNew: boolean,
    contacts: InsuredContactClass[],
    additionalNamedInsureds: insuredANI[]
}

export const newInsuredFromPacer = ( data:Params): Insured => {
  return {
    insuredCode: null,
    name: data.name.substring(0,39),
    formerName1: null,
    formerName2: null,
    sicCode: null,
    naicsCode: null,
    entityType: null,
    street1: data.streetAddress,
    street2: null,
    city: data.insuredCity,
    state: data.insuredState,
    zip: data.zip,
    county: null,
    country: data.country,
    website: null,
    comments: 'Conversion From Pacer',
    customerCode: null,
    isAddressOverride: false,
    addressVerifiedDate: null,
    fein: null,
    createdBy: '',
    createdDate: null,
    modifiedBy: '',
    modifiedDate: null,
    isNew: true,
    contacts: [],
    additionalNamedInsureds: []
  };

};