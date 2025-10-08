import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CustomerDataComponent } from './customer-data/customer-data.component';
import { Customer } from './models/customer.model';
import { CurrentPoliciesComponent } from "./current-policies/current-policies.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CustomerDataComponent, CurrentPoliciesComponent],
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
