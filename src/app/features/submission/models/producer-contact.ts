
export interface ProducerContact {
    insuredContactId: number | null,
    insuredCode: number,
    closedDate: Date | null,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    fax: string,
    display: string,
    isActive: boolean
}


export const newProducerContact = (): ProducerContact => {
  return {
    insuredContactId: null,
    insuredCode: 0,
    closedDate: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    fax: '',
    display: '',
    isActive: true
  };
};
