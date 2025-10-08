import { Component } from '@angular/core';
import { CustomerDataEntryComponent } from "./customer-data-entry/customer-data-entry.component";

@Component({
  selector: 'app-customer-data',
  imports: [CustomerDataEntryComponent],
  templateUrl: './customer-data.component.html',
  styleUrl: './customer-data.component.scss'
})
export class CustomerDataComponent {

}
