import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickmoveComponent } from './quickmove.component';

describe('QuickmoveComponent', () => {
  let component: QuickmoveComponent;
  let fixture: ComponentFixture<QuickmoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickmoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickmoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
