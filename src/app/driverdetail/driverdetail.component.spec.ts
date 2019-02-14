import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverdetailComponent } from './driverdetail.component';

describe('DriverdetailComponent', () => {
  let component: DriverdetailComponent;
  let fixture: ComponentFixture<DriverdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
