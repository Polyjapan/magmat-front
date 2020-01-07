import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStorageComponent } from './select-storage.component';

describe('SelectStorageComponent', () => {
  let component: SelectStorageComponent;
  let fixture: ComponentFixture<SelectStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
