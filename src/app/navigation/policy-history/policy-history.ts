export interface PolicyHistory {
    policyId: number;
    policyNumber: string;
    endorsementNumber: number;
    openDate: Date;
    favorite: boolean;
    hover: boolean;
}

export const newPolicyHistory = (): PolicyHistory => ({
    policyId: 0,
    policyNumber: "",
    endorsementNumber: 0,
    openDate: new Date,
    favorite: false,
    hover: false
});