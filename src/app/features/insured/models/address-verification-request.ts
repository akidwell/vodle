import { Insured } from './insured';

export interface AddressVerificationRequest {
    street1: string | null,
    street2: string | null,
    city: string | null,
    state: string| null,
    zip: string | null,
    county: string | null,
    country: string | null
}

export const newAddressVerificationReques = (insured: Insured): AddressVerificationRequest => {
  return {
    street1: insured.street1,
    street2: insured.street2,
    city: insured.city,
    state: insured.state,
    zip: insured.zip,
    county: insured.county,
    country: insured.country
  };
};