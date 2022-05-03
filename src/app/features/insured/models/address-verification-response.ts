export interface AddressVerificationResponse {
    street1: string,
    street2: string,
    city: string,
    state: string,
    zip: string,
    county: string,
    country: string,
    isVerified: boolean,
    message: string,
    verifyDate: Date
}