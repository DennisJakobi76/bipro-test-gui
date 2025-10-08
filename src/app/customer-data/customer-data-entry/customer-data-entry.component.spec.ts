import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDataEntryComponent } from './customer-data-entry.component';

describe('CustomerDataEntryComponent', () => {
  let component: CustomerDataEntryComponent;
  let fixture: ComponentFixture<CustomerDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDataEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
