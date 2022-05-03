import { Insured } from "./insured"

export interface AddressVerificationRequest {
    street1: string,
    street2: string,
    city: string,
    state: string,
    zip: string,
    county: string,
    country: string
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
    }
}