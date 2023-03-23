import { AdvancedSearchRequest } from 'src/app/features/home/models/search-results';

export class AdvancedSearchClass implements AdvancedSearchRequest{
    subStartDate!: Date | null;
    subEndDate!: Date | null;
    polEffStartDate!: Date | null;
    polEffEndDate!: Date | null;
    departmentCode!: number | null;
    programID!: number | null;
    status!: number | null;
    underwriterID!: number | null;
    filter!: string | null;
    srtRenewalFlag!: number | null;

}