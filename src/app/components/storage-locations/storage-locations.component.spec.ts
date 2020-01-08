import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocationsComponent } from './storage-locations.component';

describe('StoraeLocationsComponent', () => {
  let component: StorageLocationsComponent;
  let fixture: ComponentFixture<StorageLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
