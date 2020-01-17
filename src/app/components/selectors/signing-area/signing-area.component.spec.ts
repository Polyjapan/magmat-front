import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigningAreaComponent } from './signing-area.component';

describe('SigningAreaComponent', () => {
  let component: SigningAreaComponent;
  let fixture: ComponentFixture<SigningAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigningAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigningAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
