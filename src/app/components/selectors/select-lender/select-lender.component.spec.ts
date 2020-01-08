import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLenderComponent } from './select-lender.component';

describe('SelectLenderComponent', () => {
  let component: SelectLenderComponent;
  let fixture: ComponentFixture<SelectLenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
