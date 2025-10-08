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
