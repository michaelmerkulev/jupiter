import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivertopComponent } from './drivertop.component';

describe('DriverComponent', () => {
  let component: DrivertopComponent;
  let fixture: ComponentFixture<DrivertopComponent>;

  beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ DrivertopComponent ]
	})
	.compileComponents();
  }));

  beforeEach(() => {
	fixture = TestBed.createComponent(DrivertopComponent);
	component = fixture.componentInstance;
	fixture.detectChanges();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });
});
