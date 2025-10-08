import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-entry.component.html',
  styleUrl: './data-entry.component.scss',
})
export class DataEntryComponent {
  @Input() label!: string;
  @Input() model!: any;
  @Input() field!: string;
}
