import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLenderComponent } from './create-lender.component';

describe('CreateLenderComponent', () => {
  let component: CreateLenderComponent;
  let fixture: ComponentFixture<CreateLenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
