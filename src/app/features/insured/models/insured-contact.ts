
export interface InsuredContact {
    insuredContactId: number,
    insuredCode: number,
    isPrimary: boolean,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    fax: string,
    createdBy: string,
    createdDate: Date | null,
    modifiedBy: string,
    modifiedDate: Date | null
    isNew: boolean
}

export const newInsuredContact = (): InsuredContact => {
    return {
        insuredContactId: 0,
        insuredCode: 0,
        isPrimary: false,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        fax: "",
        createdBy: "",
        createdDate: null,
        modifiedBy: "",
        modifiedDate: null,
        isNew: true
    }
}