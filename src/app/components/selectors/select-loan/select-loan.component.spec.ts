import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLoanComponent } from './select-loan.component';

describe('SelectLoanComponent', () => {
  let component: SelectLoanComponent;
  let fixture: ComponentFixture<SelectLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
