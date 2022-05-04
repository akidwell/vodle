
export interface InsuredContact {
    insuredContactId: number | null,
    insuredCode: number,
    isPrimary: boolean,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    fax: string,
    isNew: boolean
}

export const newInsuredContact = (): InsuredContact => {
    return {
        insuredContactId: null,
        insuredCode: 0,
        isPrimary: false,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        fax: "",
        isNew: true
    }
}