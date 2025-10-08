import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataEntryComponent } from '../data-entry/data-entry.component';
import { Customer } from '../models/customer.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-data',
  standalone: true,
  imports: [DataEntryComponent, CommonModule],
  templateUrl: './customer-data.component.html',
  styleUrl: './customer-data.component.scss',
})
export class CustomerDataComponent implements OnInit {
  @Input({ required: true }) customer!: Customer;
  @Output() customerChange = new EventEmitter<Customer>();
  @Output() save = new EventEmitter<Customer>();

  fields: string[] = [];

  private wasComplete = false;

  readonly LABELS: Record<string, string> = {
    firstName: 'Vorname',
    lastName: 'Nachname',
    street: 'Straße',
    houseNumber: 'Hausnummer',
    postalCode: 'PLZ',
    city: 'Ort',
  };

  ngOnInit() {
    this.fields = Object.keys(this.customer);
  }

  labelFor(field: string): string {
    return this.LABELS[field] ?? field;
  }

  onAnyFieldChange() {
    this.customerChange.emit(this.customer);
  }

  onSaveClick() {
    if (!this.isComplete) return;

    const c = new Customer(
      this.customer.firstName?.trim(),
      this.customer.lastName?.trim(),
      this.customer.street?.trim(),
      this.customer.houseNumber?.trim(),
      this.customer.postalCode?.trim(),
      this.customer.city?.trim()
    );
    this.save.emit(c);
  }

  get isComplete(): boolean {
    return this.fields.every(
      (f) =>
        (this.customer[f as keyof Customer] ?? '').toString().trim().length > 0
    );
  }
}
