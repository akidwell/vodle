import { Moment } from 'moment';

export interface ProducerContact {
    contactId: number | null,
    producerCode: number | null,
    closedDate: Date | Moment | null,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    fax: string,
    display: string,
    isActive: boolean
}
