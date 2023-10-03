export interface Rate {
    sequenceNo: number | null;
    rateBasis: number | undefined;
    premiumRate: number | undefined;
    isFlatRate: boolean | undefined;
    premium: number | undefined;
}