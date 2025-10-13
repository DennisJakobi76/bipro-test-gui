import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataEntryComponent } from '../data-entry/data-entry.component';
import { CommonModule } from '@angular/common';
import { CurrentPolicy } from '../models/current-policy.model';
import { Customer } from '../models/customer.model';
import { BiproCancellationService } from '../services/bipro-cancellation.service';

@Component({
  selector: 'app-current-policies',
  imports: [DataEntryComponent, CommonModule],
  templateUrl: './current-policies.component.html',
  styleUrl: './current-policies.component.scss',
})
/**
 * Component for displaying and managing the current insurance policies of a customer.
 *
 * @remarks
 * - Allows editing of a single policy at a time.
 * - Emits events when a policy is changed or saved.
 * - Integrates with a BiPRO cancellation service to initiate policy cancellation processes.
 *
 * @example
 * ```html
 * <app-current-policies
 *   [policies]="policies"
 *   [customer]="customer"
 *   (policyChange)="onPolicyChange($event)"
 *   (save)="onSave($event)">
 * </app-current-policies>
 * ```
 *
 * @inputs
 * - `policies`: The list of current policies to display and edit.
 * - `customer`: The customer associated with the policies.
 *
 * @outputs
 * - `policyChange`: Emits when any field of the current policy changes.
 * - `save`: Emits when the current policy is saved.
 *
 * @dependencies
 * - `BiproCancellationService`: Service used to initiate BiPRO cancellation processes.
 *
 * @methods
 * - `onAnyFieldChange()`: Emits the `policyChange` event when a policy field changes.
 * - `onSaveClick()`: Validates and saves the current policy, emitting the `save` event.
 * - `onStartBiPROClick()`: Initiates the BiPRO cancellation process for the current policy and customer.
 */
export class CurrentPoliciesComponent implements OnInit {
  @Input() policies: CurrentPolicy[] = [];
  @Input() customer?: Customer;
  @Output() policyChange = new EventEmitter<CurrentPolicy>();
  @Output() save = new EventEmitter<CurrentPolicy>();

  fields: string[] = [];

  constructor(private biproCancellationService: BiproCancellationService) {}

  get currentPolicy(): CurrentPolicy {
    return this.policies[0];
  }

  readonly LABELS: Record<string, string> = {
    policyNumber: 'Policennummer',
    productName: 'Produktname',
    startDate: 'Versicherungsbeginn',
    endDate: 'Ablaufdatum',
    insuranceCompany: 'Versicherungsgesellschaft',
  };

  ngOnInit(): void {
    this.fields = Object.keys(this.LABELS);
    if (this.policies.length === 0) {
      this.policies.push(new CurrentPolicy('', '', '', '', ''));
    }
  }

  labelFor(field: string): string {
    return this.LABELS[field] ?? field;
  }

  get isComplete(): boolean {
    return this.fields.every(
      (f) =>
        (this.currentPolicy[f as keyof CurrentPolicy] ?? '').toString().trim()
          .length > 0
    );
  }

  onAnyFieldChange() {
    this.policyChange.emit(this.currentPolicy);
  }

  onSaveClick() {
    if (!this.isComplete) return;

    const p = new CurrentPolicy(
      this.currentPolicy.policyNumber?.trim(),
      this.currentPolicy.productName?.trim(),
      this.currentPolicy.startDate?.trim(),
      this.currentPolicy.endDate?.trim(),
      this.currentPolicy.insuranceCompany?.trim()
    );
    this.policies[0] = p;
    this.save.emit(p);
    console.log('Saved policy:', this.policies[0]);
  }

  async onStartBiPROClick() {
    if (!this.customer) {
      console.error('Customer data is required for BiPRO cancellation');
      alert('Bitte speichern Sie zuerst die Kundendaten.');
      return;
    }

    if (!this.isComplete) {
      console.error('Policy data is incomplete');
      alert('Bitte vervollständigen Sie alle Policen-Felder.');
      return;
    }

    try {
      await this.biproCancellationService.startBipro(
        this.customer,
        this.currentPolicy
      );
      console.log('BiPRO cancellation process initiated successfully');
    } catch (error) {
      console.error('Failed to start BiPRO cancellation:', error);
      alert(
        'Fehler beim Starten des Kündigungsprozesses. Bitte versuchen Sie es erneut.'
      );
    }
  }
}
