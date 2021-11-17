export interface ReinsuranceLookup {
    effectiveDate: Date,
    expirationDate: Date,
    treatyNumber: number,
    treatyName: string,
    cededCommissionRate: number,
    layerNumber: number,
    isDefault: boolean
}