/**
 * The root component of the BiPRO Test GUI application.
 *
 * @remarks
 * This component serves as the main entry point for the application and includes
 * the router outlet, header, customer data, and current policies components.
 *
 * @property {string} title - The title of the application.
 * @property {Customer} customerDraft - A draft instance of a customer used for data entry.
 * @property {Customer | undefined} finalCustomer - The finalized customer data after saving.
 *
 * @method onSave
 * Handles the event when customer data is saved. Sets the `finalCustomer` property
 * and logs the finalized customer to the console.
 *
 * @param {Customer} c - The customer data to be finalized and saved.
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CustomerDataComponent } from './customer-data/customer-data.component';
import { Customer } from './models/customer.model';
import { CurrentPoliciesComponent } from './current-policies/current-policies.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    CustomerDataComponent,
    CurrentPoliciesComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bipro-test-gui';
  customerDraft = new Customer('', '', '', '', '', '');

  finalCustomer?: Customer;

  onSave(c: Customer) {
    this.finalCustomer = c;
    console.log('Final customer:', this.finalCustomer);
  }
}
