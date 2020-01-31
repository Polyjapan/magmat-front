import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateObjectComponent } from './update-object.component';

describe('UpdateObjectComponent', () => {
  let component: UpdateObjectComponent;
  let fixture: ComponentFixture<UpdateObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
