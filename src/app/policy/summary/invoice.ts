export interface InvoiceData {
  policyId: number;
  PolicySymbol: string;
  FullPolicyNumber: string;
  endorsementNumber: number;
  invoiceNumber?: number | null;
  invoiceStatus: string;
  invoiceStatusDescription: string;
  proFlag?: number | null;
  invoiceDate?: Date | null;
  dueDate?: Date | null;
  effectiveDate?: Date | null;
  expirationDate?: Date | null;
  voidDate?: Date | null;
  transactionTypeCode: number;
  transctionTypeDescription: string;
  reason: string;
  comment: string;
  invoiceDetail: InvoiceDetail[];
  isNew: boolean;
  isUpdated: boolean;
}

export const newInvoice = (): InvoiceData => ({
  policyId: 0,
  PolicySymbol: '',
  FullPolicyNumber: '',
  endorsementNumber: 0,
  invoiceNumber: null,
  invoiceStatus: 'N',
  invoiceStatusDescription: 'New',
  proFlag: 0,
  invoiceDate: new Date(),
  dueDate: null,
  effectiveDate: null,
  expirationDate: null,
  voidDate: null,
  transactionTypeCode: 0,
  transctionTypeDescription: '',
  reason: '',
  comment: '',
  invoiceDetail: [],
  isNew: true,
  isUpdated: true
});

export interface InvoiceDetail {
  invoiceNumber?: number | null;
  lineNumber: number;
  lineItemCode: string;
  lineItemDescription: string;
  transactionType: number;
  feeAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  percentCharge?: number;
  isNew: boolean;
  isUpdated: boolean;
}

export const newInvoiceDetail = (): InvoiceDetail => ({
  invoiceNumber: 0,
  lineNumber: 1,
  lineItemCode: '',
  lineItemDescription: '',
  transactionType: 0,
  feeAmount: 0,
  commissionRate: 0,
  commissionAmount: 0,
  netAmount: 0,
  percentCharge: 0,
  isNew: true,
  isUpdated: true
});

export interface InvoiceResolved {
  invoicesData: InvoiceData[] | null;
  error?: any;
}