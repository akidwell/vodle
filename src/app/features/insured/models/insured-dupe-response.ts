export interface InsuredDupeResponse {
    insuredCode: number,
    name: string,
    street1: string,
    street2: string | null,
    city: string,
    state: string,
    zip: string,
    fein: string | null,
    matchScore: number
}
