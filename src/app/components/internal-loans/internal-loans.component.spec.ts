import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalLoansComponent } from './internal-loans.component';

describe('InternalLoansComponent', () => {
  let component: InternalLoansComponent;
  let fixture: ComponentFixture<InternalLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
