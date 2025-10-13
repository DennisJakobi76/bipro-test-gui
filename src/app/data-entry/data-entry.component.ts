/**
 * DataEntryComponent is a standalone Angular component for data entry fields.
 *
 * @remarks
 * This component displays a labeled input field and emits events when the value changes or is committed.
 *
 * @example
 * ```html
 * <app-data-entry
 *   [label]="'Name'"
 *   [model]="user"
 *   [field]="'name'"
 *   (valueChange)="onValueChange()"
 *   (commit)="onCommit()">
 * </app-data-entry>
 * ```
 *
 * @input label - The label to display for the input field.
 * @input model - The data model object to bind the input value to.
 * @input field - The property name of the model to bind.
 *
 * @output valueChange - Emits when the input value changes.
 * @output commit - Emits when the value is committed (e.g., on blur or enter).
 */
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-entry.component.html',
  styleUrl: './data-entry.component.scss',
})
export class DataEntryComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) model!: any;
  @Input({ required: true }) field!: string;

  @Output() valueChange = new EventEmitter<void>();
  @Output() commit = new EventEmitter<void>();

  onChange() {
    this.valueChange.emit();
  }
}
