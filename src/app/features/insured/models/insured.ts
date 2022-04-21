
export interface Insured {
    insuredCode: number
    name: string,
    street1: string,
    street2: string,
    city: string,
    state: string,
    zip: string,
    county: string,
    country: string,
    formerName: string,
    contactName: string,
    email: string,
    contactPhone: number | null,
    contactFax: number | null,
    addressOveridden: boolean
}

export const newInsured = (): Insured => {
    return {
        insuredCode: 0,
        name: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        county: "",
        country: "",
        formerName: "",
        contactName: "",
        email: "",
        contactPhone: null,
        contactFax: null,
        addressOveridden: false
    }
  }