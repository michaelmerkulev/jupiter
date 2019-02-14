import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytaxisComponent } from './mytaxis.component';

describe('MytaxisComponent', () => {
  let component: MytaxisComponent;
  let fixture: ComponentFixture<MytaxisComponent>;

  beforeEach(async(() => {
TestBed.configureTestingModule({
declarations: [ MytaxisComponent ]
})
.compileComponents();
  }));

  beforeEach(() => {
fixture = TestBed.createComponent(MytaxisComponent);
component = fixture.componentInstance;
fixture.detectChanges();
  });

  it('should create', () => {
expect(component).toBeTruthy();
  });
});
