export class CurrentPolicy {
  constructor(
    public policyNumber: string,
    public productName: string,
    public startDate: string,
    public endDate: string,
    public insuranceCompany: string
  ) {}
}
