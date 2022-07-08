
export interface InsuredContact extends Tracking {
    insuredContactId: number | null,
    insuredCode: number | null,
    sequence: number | null,
    isPrimary: boolean | null,
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    phone: string | null,
    fax: string | null,
}

interface Tracking {
    isNew: boolean,
    isPrimaryTracked: boolean
}
