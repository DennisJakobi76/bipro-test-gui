import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataEntryComponent } from '../data-entry/data-entry.component';
import { CommonModule } from '@angular/common';
import { CurrentPolicy } from '../models/current-policy.model';

@Component({
  selector: 'app-current-policies',
  imports: [DataEntryComponent, CommonModule],
  templateUrl: './current-policies.component.html',
  styleUrl: './current-policies.component.scss',
})
export class CurrentPoliciesComponent implements OnInit {
  @Input() policies: CurrentPolicy[] = [];
  @Output() policyChange = new EventEmitter<CurrentPolicy>();
  @Output() save = new EventEmitter<CurrentPolicy>();

  fields: string[] = [];

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
    console.log('Saved policy:', p);
  }
}
