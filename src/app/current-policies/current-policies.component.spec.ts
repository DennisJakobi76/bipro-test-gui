import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPoliciesComponent } from './current-policies.component';

describe('CurrentPoliciesComponent', () => {
  let component: CurrentPoliciesComponent;
  let fixture: ComponentFixture<CurrentPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
