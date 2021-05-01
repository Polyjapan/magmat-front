import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateLenderComponent } from './create-lender.component';

describe('CreateLenderComponent', () => {
  let component: CreateLenderComponent;
  let fixture: ComponentFixture<CreateLenderComponent>;

  beforeEach(waitForAsync(() => {
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
