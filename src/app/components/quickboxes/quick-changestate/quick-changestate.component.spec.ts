import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickChangestateComponent } from './quick-changestate.component';

describe('QuickChangestateComponent', () => {
  let component: QuickChangestateComponent;
  let fixture: ComponentFixture<QuickChangestateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickChangestateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickChangestateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
