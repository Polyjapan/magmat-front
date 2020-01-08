import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateObjectTypeComponent } from './create-object-type.component';

describe('CreateObjectTypeComponent', () => {
  let component: CreateObjectTypeComponent;
  let fixture: ComponentFixture<CreateObjectTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateObjectTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateObjectTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
