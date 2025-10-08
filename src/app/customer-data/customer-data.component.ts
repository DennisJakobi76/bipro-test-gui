import { Component } from '@angular/core';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { Customer } from '../models/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-data',
  standalone: true,
  imports: [DataEntryComponent, CommonModule],
  templateUrl: './customer-data.component.html',
  styleUrl: './customer-data.component.scss',
})
export class CustomerDataComponent {
  customer: Customer = new Customer('', '', '', '', '', '');
  fields: string[] = [];

  ngOnInit() {
    this.fields = Object.keys(this.customer);
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
