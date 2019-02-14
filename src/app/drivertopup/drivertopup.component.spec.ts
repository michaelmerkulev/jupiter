import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivertopupComponent } from './drivertopup.component';

describe('DrivertopupComponent', () => {
  let component: DrivertopupComponent;
  let fixture: ComponentFixture<DrivertopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivertopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivertopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
