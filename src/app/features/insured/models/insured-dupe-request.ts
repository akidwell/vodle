import { Insured } from './insured';

export interface InsuredDupeRequest {
    name: string,
    street1: string,
    city: string,
    fein: string | null
}

export const newInsuredDupeRequst = (insured: Insured): InsuredDupeRequest => {
  return {
    name: insured.name,
    street1: insured.street1,
    city: insured.city,
    fein: insured.fein
  };
};