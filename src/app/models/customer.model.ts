/**
 * Represents a customer with personal and address information.
 *
 * @class Customer
 * @param firstName - The customer's first name.
 * @param lastName - The customer's last name.
 * @param street - The street name of the customer's address.
 * @param houseNumber - The house number of the customer's address.
 * @param postalCode - The postal code of the customer's address.
 * @param city - The city of the customer's address.
 */
export class Customer {
  constructor(
    public firstName: string,
    public lastName: string,
    public street: string,
    public houseNumber: string,
    public postalCode: string,
    public city: string
  ) {}
}
