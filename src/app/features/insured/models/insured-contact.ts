
export interface InsuredContact extends Tracking {
    insuredContactId: number | null,
    insuredCode: number,
    isPrimary: boolean,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    fax: string,
}

interface Tracking {
    isNew: boolean,
    isPrimaryTracked: boolean
}

export const newInsuredContact = (): InsuredContact => {
  return {
    insuredContactId: null,
    insuredCode: 0,
    isPrimary: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    fax: '',
    isPrimaryTracked: false,
    isNew: true
  };
};
