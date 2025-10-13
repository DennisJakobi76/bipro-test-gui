/**
 * Represents the details of a current insurance policy.
 *
 * @remarks
 * This model holds basic information about an insurance policy, including its number,
 * product name, validity period, and the associated insurance company.
 *
 * @param policyNumber - The unique identifier for the policy.
 * @param productName - The name of the insurance product.
 * @param startDate - The start date of the policy (ISO string format).
 * @param endDate - The end date of the policy (ISO string format).
 * @param insuranceCompany - The name of the insurance company providing the policy.
 */
export class CurrentPolicy {
  constructor(
    public policyNumber: string,
    public productName: string,
    public startDate: string,
    public endDate: string,
    public insuranceCompany: string
  ) {}
}
