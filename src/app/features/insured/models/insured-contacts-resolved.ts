import { InsuredContact } from "./insured-contact";

export interface InsuredContactsResolved {
    insuredContacts:  InsuredContact[] | null;
    error?: any;
  }
  