import { Params } from '@angular/router';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { InsuredService } from '../services/insured-service/insured.service';
import { InsuredContact } from './insured-contact';

export interface Insured {
    insuredCode: number | null,
    name: string,
    formerName1: string | null,
    formerName2: string | null,
    sicCode: string | null,
    naicsCode: string | null,
    entityType: number | null,
    street1: string,
    street2: string | null,
    city: string,
    state: string,
    zip: string,
    county: string | null,
    country: string | null,
    website: string | null,
    comments: string | null,
    customerCode: number | null,
    isAddressOverride: boolean,
    addressVerifiedDate: Date | null,
    fein: string | null,
    createdBy: string,
    createdDate: Date | null,
    modifiedBy: string,
    modifiedDate: Date | null,
    isNew: boolean,
    contacts: InsuredContact[],
    additionalNamedInsureds: insuredANI[]
}

export const newInsured = (): Insured => {
  return {
    insuredCode: null,
    name: '',
    formerName1: null,
    formerName2: null,
    sicCode: null,
    naicsCode: null,
    entityType: null,
    street1: '',
    street2: null,
    city: '',
    state: '',
    zip: '',
    county: null,
    country: null,
    website: null,
    comments: null,
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

export const newInsuredFromPacer = (ani: insuredANI[], data:Params): Insured => {
  return {
    insuredCode: null,
    name: data.name.substring(0,79),
    formerName1: null,
    formerName2: null,
    sicCode: null,
    naicsCode: null,
    entityType: null,
    street1: data.streetAddress,
    street2: null,
    city: data.insuredCity,
    state: data.stateName,
    zip: data.zip,
    county: null,
    country: null,
    website: null,
    comments: 'From Pacer',
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
    additionalNamedInsureds: ani

  };

};