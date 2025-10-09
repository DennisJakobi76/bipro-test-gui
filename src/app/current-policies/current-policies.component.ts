import { Component, Input, OnInit } from '@angular/core';
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

  fields: string[] = [];

  readonly LABELS: Record<string, string> = {
    policyNumber: 'Policennummer',
    productName: 'Produktname',
    startDate: 'Versicherungsbeginn',
    endDate: 'Ablaufdatum',
    insuranceCompany: 'Versicherungsgesellschaft',
  };

  ngOnInit(): void {
    this.fields = Object.keys(this.LABELS);
  }

  labelFor(field: string): string {
    return this.LABELS[field] ?? field;
  }
}
